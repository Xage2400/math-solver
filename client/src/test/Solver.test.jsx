import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Solver from '../components/Solver'

const mockProps = {
  setSteps: vi.fn(),
  setResult: vi.fn(),
  setError: vi.fn(),
  setIsLoading: vi.fn(),
}

describe('Solver component', () => {
  it('renders the input field', () => {
    render(<Solver {...mockProps} />)
    expect(screen.getByPlaceholderText(/e.g./i)).toBeInTheDocument()
  })

  it('renders the solve button', () => {
    render(<Solver {...mockProps} />)
    expect(screen.getByText('=')).toBeInTheDocument()
  })

  it('renders the clear button', () => {
    render(<Solver {...mockProps} />)
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders example chips', () => {
    render(<Solver {...mockProps} />)
    expect(screen.getByText('2 + 3 * 4')).toBeInTheDocument()
  })

  it('clicking an example chip fills the input', () => {
    render(<Solver {...mockProps} />)
    fireEvent.click(screen.getByText('2 + 3 * 4'))
    expect(screen.getByDisplayValue('2 + 3 * 4')).toBeInTheDocument()
  })

  it('clicking clear button empties the input', () => {
    render(<Solver {...mockProps} />)
    fireEvent.click(screen.getByText('2 + 3 * 4'))
    fireEvent.click(screen.getByText('C'))
    expect(screen.getByPlaceholderText(/e.g./i).value).toBe('')
  })

  it('calls setError when solve is clicked with empty input', () => {
    render(<Solver {...mockProps} />)
    fireEvent.click(screen.getByText('='))
    expect(mockProps.setError).toHaveBeenCalledWith('Please enter an expression')
  })

  it('calls setSteps and setResult when valid expression is entered', () => {
    render(<Solver {...mockProps} />)
    fireEvent.change(screen.getByPlaceholderText(/e.g./i), {
      target: { value: '2 + 2' }
    })
    fireEvent.click(screen.getByText('='))
    expect(mockProps.setResult).toHaveBeenCalledWith('4')
    expect(mockProps.setSteps).toHaveBeenCalled()
  })

  it('pressing Enter triggers solve', () => {
    render(<Solver {...mockProps} />)
    const input = screen.getByPlaceholderText(/e.g./i)
    fireEvent.change(input, { target: { value: '3 * 3' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockProps.setResult).toHaveBeenCalledWith('9')
  })
})