import { BaseService } from '../../services/baseService'

// Mock fetchWithAuth
jest.mock('../../helpers/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}))

const mockFetchWithAuth = require('../../helpers/fetchWithAuth').fetchWithAuth

describe('BaseService', () => {
  let service: BaseService<any>
  const mockData = { id: '1', name: 'Test Item' }

  beforeEach(() => {
    service = new BaseService('test-endpoint')
    jest.clearAllMocks()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
  })

  describe('getAll', () => {
    it('should fetch all items successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([mockData]),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      const result = await service.getAll()

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
        }
      )
      expect(result).toEqual([mockData])
    })

    it('should fetch all items with query successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([mockData]),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await service.getAll('status=active')

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint?status=active',
        expect.any(Object)
      )
    })

    it('should throw error when fetch fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await expect(service.getAll()).rejects.toEqual({
        message: 'Erro ao buscar dados',
        error: 'Server error',
      })
    })
  })

  describe('get', () => {
    it('should fetch item by id successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      const result = await service.get('1')

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint/1',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
        }
      )
      expect(result).toEqual(mockData)
    })

    it('should throw error when fetch fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Not found' }),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await expect(service.get('1')).rejects.toEqual({
        message: 'Erro ao buscar item',
        error: 'Not found',
      })
    })
  })

  describe('create', () => {
    it('should create item successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      const result = await service.create(mockData)

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          body: JSON.stringify(mockData),
        }
      )
      expect(result).toEqual(mockData)
    })

    it('should create item with custom endpoint', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await service.create(mockData, 'custom-endpoint')

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/custom-endpoint',
        expect.any(Object)
      )
    })

    it('should throw error when creation fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Validation error' }),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await expect(service.create(mockData)).rejects.toEqual({
        message: 'Erro ao criar item',
        error: 'Validation error',
      })
    })
  })

  describe('update', () => {
    it('should update item successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      const result = await service.update('1', mockData)

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          body: JSON.stringify(mockData),
        }
      )
      expect(result).toEqual(mockData)
    })

    it('should throw error when update fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Update failed' }),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await expect(service.update('1', mockData)).rejects.toEqual({
        message: 'Erro ao atualizar item',
        error: 'Update failed',
      })
    })
  })

  describe('delete', () => {
    it('should delete item successfully', async () => {
      const mockResponse = {
        ok: true,
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await service.delete('1')

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
        }
      )
    })

    it('should throw error when delete fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Delete failed' }),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await expect(service.delete('1')).rejects.toEqual({
        message: 'Erro ao deletar item',
        error: 'Delete failed',
      })
    })
  })

  describe('without token', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => null),
        },
        writable: true,
      })
    })

    it('should make request without authorization header when no token', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([mockData]),
      }
      mockFetchWithAuth.mockResolvedValue(mockResponse)

      await service.getAll()

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'http://localhost:3300/test-endpoint',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    })
  })
})
