import { render, screen } from '@testing-library/react'
import { SnackbarComponent } from '../../components/snackbar'

// Mock MUI components
jest.mock('@mui/material', () => ({
  Snackbar: ({ children, open, ...props }: any) => 
    open ? <div data-testid="snackbar" {...props}>{children}</div> : null,
  Alert: ({ children, onClose, severity, ...props }: any) => (
    <div role="alert" className={`MuiAlert-standard${severity.charAt(0).toUpperCase() + severity.slice(1)}`} {...props}>
      {children}
      <button onClick={onClose} aria-label="close">X</button>
    </div>
  ),
}))

describe('SnackbarComponent', () => {
  const defaultProps = {
    open: true,
    message: 'Test message',
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the snackbar when open is true', () => {
    render(<SnackbarComponent {...defaultProps} />)
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByTestId('snackbar')).toBeInTheDocument()
  })

  it('should not render the snackbar when open is false', () => {
    render(<SnackbarComponent {...defaultProps} open={false} />)
    
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument()
  })

  it('should render with success severity by default', () => {
    render(<SnackbarComponent {...defaultProps} />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardSuccess')
  })

  it('should render with custom severity', () => {
    render(<SnackbarComponent {...defaultProps} severity="error" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardError')
  })
})
