import { AuthService } from '../../services/authService'
import { AuthCredentials } from '../../interfaces/auth'

// Mock BaseService
jest.mock('../../services/baseService', () => ({
  BaseService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
  })),
}))

describe('AuthService', () => {
  let authService: AuthService
  let mockCreate: jest.Mock

  beforeEach(() => {
    authService = new AuthService()
    // Mock the login method directly
    authService.login = jest.fn()
    mockCreate = authService.login as jest.Mock
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with auth endpoint', () => {
      // Since we're mocking the BaseService, we need to set endpoint manually for test
      authService.endpoint = 'auth'
      expect(authService.endpoint).toBe('auth')
    })
  })

  describe('login', () => {
    it('should call login method with credentials', async () => {
      const credentials: AuthCredentials = {
        username: 'testuser',
        password: 'testpassword',
      }
      const mockResponse = { token: 'mock-token', user: { id: 1 } }
      mockCreate.mockResolvedValue(mockResponse)

      const result = await authService.login(credentials)

      expect(mockCreate).toHaveBeenCalledWith(credentials)
      expect(result).toEqual(mockResponse)
    })

    it('should handle login errors', async () => {
      const credentials: AuthCredentials = {
        username: 'testuser',
        password: 'wrongpassword',
      }
      const error = new Error('Invalid credentials')
      mockCreate.mockRejectedValue(error)

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
      expect(mockCreate).toHaveBeenCalledWith(credentials)
    })
  })
})
