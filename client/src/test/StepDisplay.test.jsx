import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StepDisplay from '../components/StepDisplay'

const mockSteps = [
  { label: 'Input', detail: '2 + 3', type: 'input' },
  { label: 'Result', detail: '5', type: 'result' },
]

describe('StepDisplay component', () => {
  it('renders empty state by default', () => {
    render(<StepDisplay steps={[]} result={null} error={null} isLoading={false} />)
    expect(screen.getByText(/Enter an expression/i)).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<StepDisplay steps={[]} result={null} error={null} isLoading={true} />)
    expect(screen.getByText(/Solving/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    render(<StepDisplay steps={[]} result={null} error="Cannot divide by zero" isLoading={false} />)
    expect(screen.getByText(/Cannot divide by zero/i)).toBeInTheDocument()
  })

  it('renders steps when provided', () => {
    render(<StepDisplay steps={mockSteps} result="5" error={null} isLoading={false} />)
    expect(screen.getByText('2 + 3')).toBeInTheDocument()
  })

  it('renders final result', () => {
    render(<StepDisplay steps={mockSteps} result="5" error={null} isLoading={false} />)
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1)
  })

  it('renders solution heading when steps exist', () => {
    render(<StepDisplay steps={mockSteps} result="5" error={null} isLoading={false} />)
    expect(screen.getByText('Solution')).toBeInTheDocument()
  })

  it('renders all step labels', () => {
    render(<StepDisplay steps={mockSteps} result="5" error={null} isLoading={false} />)
    expect(screen.getByText('Input')).toBeInTheDocument()
    expect(screen.getAllByText('Result').length).toBeGreaterThanOrEqual(1)
  })

  it('renders supported features in empty state', () => {
    render(<StepDisplay steps={[]} result={null} error={null} isLoading={false} />)
    expect(screen.getByText(/Arithmetic & BODMAS/i)).toBeInTheDocument()
    expect(screen.getByText(/Derivatives/i)).toBeInTheDocument()
  })
})