import { describe, it, expect } from 'vitest'
import { solveStepByStep, validateExpression } from '../utils/mathSolver'

describe('validateExpression', () => {
  it('throws if expression is empty', () => {
    expect(() => validateExpression('')).toThrow('Please enter an expression')
  })

  it('throws if expression is too long', () => {
    expect(() => validateExpression('a'.repeat(201))).toThrow('Expression is too long')
  })

  it('throws if expression contains invalid characters', () => {
    expect(() => validateExpression('2 + 2; DROP TABLE')).toThrow('Expression contains invalid characters')
  })

  it('passes for a valid expression', () => {
    expect(() => validateExpression('2 + 3')).not.toThrow()
  })
})

describe('solveStepByStep', () => {
  it('solves basic arithmetic', () => {
    const { result } = solveStepByStep('2 + 3')
    expect(result).toBe('5')
  })

  it('respects order of operations', () => {
    const { result } = solveStepByStep('2 + 3 * 4')
    expect(result).toBe('14')
  })

  it('solves powers', () => {
    const { result } = solveStepByStep('2^10')
    expect(result).toBe('1024')
  })

  it('solves square roots', () => {
    const { result } = solveStepByStep('sqrt(144)')
    expect(result).toBe('12')
  })

  it('solves trigonometry', () => {
    const { result } = solveStepByStep('sin(pi / 6)')
    expect(Number(result)).toBeCloseTo(0.5, 5)
  })

  it('solves logarithms', () => {
    const { result } = solveStepByStep('log(1000, 10)')
    expect(Number(result)).toBeCloseTo(3, 5)
  })

  it('solves derivatives', () => {
    const { result } = solveStepByStep('derivative(x^2, x)')
    expect(result).toContain('2')
  })

  it('throws on division by zero', () => {
    expect(() => solveStepByStep('1 / 0')).toThrow()
  })

  it('returns steps array with at least 2 steps', () => {
    const { steps } = solveStepByStep('2 + 3')
    expect(steps.length).toBeGreaterThanOrEqual(2)
  })

  it('first step type is input', () => {
    const { steps } = solveStepByStep('2 + 3')
    expect(steps[0].type).toBe('input')
  })

  it('last step type is result', () => {
    const { steps } = solveStepByStep('2 + 3')
    expect(steps[steps.length - 1].type).toBe('result')
  })

  it('handles negative numbers', () => {
    const { result } = solveStepByStep('-5 + 3')
    expect(result).toBe('-2')
  })

  it('handles decimals', () => {
    const { result } = solveStepByStep('1.5 + 2.5')
    expect(result).toBe('4')
  })

  it('handles parentheses', () => {
    const { result } = solveStepByStep('(2 + 3) * 4')
    expect(result).toBe('20')
  })
})