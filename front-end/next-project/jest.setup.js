import '@testing-library/jest-dom'

// Silence MUI warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React does not recognize') ||
       args[0].includes('autoHideDuration') ||
       args[0].includes('anchorOrigin'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock serviceWorker
Object.defineProperty(window.navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve({})),
    getRegistration: jest.fn(() => Promise.resolve({})),
    ready: Promise.resolve({}),
  },
  writable: true,
})

// Mock fetch
global.fetch = jest.fn()
