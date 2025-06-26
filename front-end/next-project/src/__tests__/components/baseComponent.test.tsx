import { render, screen, fireEvent } from '@testing-library/react'
import { BaseComponent } from '../../components/baseComponent'

describe('BaseComponent', () => {
  it('should render children with snackbar helpers', () => {
    const mockChildren = jest.fn(() => <div>Test Content</div>)
    
    render(<BaseComponent>{mockChildren}</BaseComponent>)
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(mockChildren).toHaveBeenCalledWith({
      openSnackbar: false,
      setOpenSnackbar: expect.any(Function),
      handleOpenSnackbar: expect.any(Function),
      handleCloseSnackbar: expect.any(Function),
    })
  })

  it('should not show snackbar when no message is provided', () => {
    render(
      <BaseComponent>
        {() => <div>Test Content</div>}
      </BaseComponent>
    )
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should show snackbar when message is provided and snackbar is open', () => {
    render(
      <BaseComponent snackbarMessage="Test Message">
        {({ handleOpenSnackbar }) => (
          <button onClick={handleOpenSnackbar}>Open Snackbar</button>
        )}
      </BaseComponent>
    )
    
    const button = screen.getByText('Open Snackbar')
    fireEvent.click(button)
    
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  it('should use success severity by default', () => {
    render(
      <BaseComponent snackbarMessage="Test Message">
        {({ handleOpenSnackbar }) => (
          <button onClick={handleOpenSnackbar}>Open Snackbar</button>
        )}
      </BaseComponent>
    )
    
    const button = screen.getByText('Open Snackbar')
    fireEvent.click(button)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardSuccess')
  })

  it('should use custom severity when provided', () => {
    render(
      <BaseComponent snackbarMessage="Error Message" snackbarSeverity="error">
        {({ handleOpenSnackbar }) => (
          <button onClick={handleOpenSnackbar}>Open Snackbar</button>
        )}
      </BaseComponent>
    )
    
    const button = screen.getByText('Open Snackbar')
    fireEvent.click(button)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardError')
  })

  it('should close snackbar when handleCloseSnackbar is called', () => {
    render(
      <BaseComponent snackbarMessage="Test Message">
        {({ handleOpenSnackbar, handleCloseSnackbar, openSnackbar }) => (
          <div>
            <button onClick={handleOpenSnackbar}>Open Snackbar</button>
            <button onClick={handleCloseSnackbar}>Close Snackbar</button>
            <span>{openSnackbar ? 'Open' : 'Closed'}</span>
          </div>
        )}
      </BaseComponent>
    )
    
    const openButton = screen.getByText('Open Snackbar')
    const closeButton = screen.getByText('Close Snackbar')
    
    // Initially closed
    expect(screen.getByText('Closed')).toBeInTheDocument()
    
    // Open snackbar
    fireEvent.click(openButton)
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
    
    // Close snackbar
    fireEvent.click(closeButton)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('should allow setting snackbar state directly', () => {
    render(
      <BaseComponent snackbarMessage="Test Message">
        {({ setOpenSnackbar, openSnackbar }) => (
          <div>
            <button onClick={() => setOpenSnackbar(true)}>Set Open</button>
            <button onClick={() => setOpenSnackbar(false)}>Set Closed</button>
            <span>{openSnackbar ? 'Open' : 'Closed'}</span>
          </div>
        )}
      </BaseComponent>
    )
    
    const setOpenButton = screen.getByText('Set Open')
    const setClosedButton = screen.getByText('Set Closed')
    
    // Initially closed
    expect(screen.getByText('Closed')).toBeInTheDocument()
    
    // Set open
    fireEvent.click(setOpenButton)
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
    
    // Set closed
    fireEvent.click(setClosedButton)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })
})
