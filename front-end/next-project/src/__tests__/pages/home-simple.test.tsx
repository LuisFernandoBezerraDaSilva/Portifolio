import { render, screen } from '@testing-library/react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock AuthService
jest.mock('../../services/authService', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
  })),
}))

// Mock Firebase and other dependencies
jest.mock('../../../firebase', () => ({
  messaging: {},
}))

jest.mock('firebase/messaging', () => ({
  getToken: jest.fn(),
}))

// Simple test for the Home component
describe('Home Page - Basic Tests', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    })

    // Mock navigator.serviceWorker
    Object.defineProperty(window.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.resolve({})),
      },
      writable: true,
    })
  })

  it('should render without crashing', () => {
    // Dynamic import to avoid static import issues
    const Home = require('../../app/page').default
    
    const { container } = render(<Home />)
    
    // Test that the component renders without throwing
    expect(container).toBeInTheDocument()
  })

  it('should render login form elements', () => {
    const Home = require('../../app/page').default
    render(<Home />)
    
    // Use more flexible queries for MUI components
    expect(screen.getByText('Login')).toBeInTheDocument()
    
    // Check for user input by label text (MUI uses labels)
    const userInput = screen.queryByLabelText(/usuário/i) || 
                     document.querySelector('input[type="text"]')
    expect(userInput).toBeTruthy()
    
    // Check for password field by label or type
    const passwordInput = screen.queryByLabelText(/senha/i) || 
                         document.querySelector('input[type="password"]')
    expect(passwordInput).toBeTruthy()
    
    // Check for submit button by text content
    const submitButton = screen.queryByRole('button', { name: /entrar/i }) ||
                        screen.queryByText(/entrar/i)
    expect(submitButton).toBeTruthy()
    
    // Check that we have the expected form structure
    const form = document.querySelector('form')
    expect(form).toBeTruthy()
  })
})
