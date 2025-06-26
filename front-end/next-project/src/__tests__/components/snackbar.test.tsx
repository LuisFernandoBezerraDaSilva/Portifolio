import { render, screen, fireEvent } from '@testing-library/react'
import { SnackbarComponent } from '../../components/snackbar'

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
  })

  it('should not render the snackbar when open is false', () => {
    render(<SnackbarComponent {...defaultProps} open={false} />)
    
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(<SnackbarComponent {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should render with success severity by default', () => {
    render(<SnackbarComponent {...defaultProps} />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardSuccess')
  })

  it('should render with error severity when specified', () => {
    render(<SnackbarComponent {...defaultProps} severity="error" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardError')
  })

  it('should render with warning severity when specified', () => {
    render(<SnackbarComponent {...defaultProps} severity="warning" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardWarning')
  })

  it('should render with info severity when specified', () => {
    render(<SnackbarComponent {...defaultProps} severity="info" />)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardInfo')
  })

  it('should use default autoHideDuration of 2000ms', () => {
    const { container } = render(<SnackbarComponent {...defaultProps} />)
    
    const snackbar = container.querySelector('.MuiSnackbar-root')
    expect(snackbar).toBeInTheDocument()
  })

  it('should use custom autoHideDuration when provided', () => {
    const { container } = render(
      <SnackbarComponent {...defaultProps} autoHideDuration={5000} />
    )
    
    const snackbar = container.querySelector('.MuiSnackbar-root')
    expect(snackbar).toBeInTheDocument()
  })
})
