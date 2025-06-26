import { render } from '@testing-library/react'
import { ReactElement } from 'react'

// Custom render function that wraps components with providers if needed
export const renderWithProviders = (ui: ReactElement, options = {}) => {
  return render(ui, {
    ...options,
  })
}

// Mock implementations for common services
export const createMockAuthService = () => ({
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
})

export const createMockTaskService = () => ({
  getAll: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
})

export const createMockUserService = () => ({
  getAll: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
})

// Helper to create mock router
export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
})

// Helper to setup localStorage mock
export const setupLocalStorageMock = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
  return localStorageMock
}

// Helper to create mock fetch response
export const createMockResponse = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data)),
})

// Common test data
export const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
}

export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  userId: '1',
}

export const mockAuthCredentials = {
  username: 'testuser',
  password: 'testpassword',
  fcmToken: 'mock-fcm-token',
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))
