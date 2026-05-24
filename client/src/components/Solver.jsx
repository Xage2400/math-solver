import { useState } from 'react'
import { solveStepByStep } from '../utils/mathSolver'

const EXAMPLE_EXPRESSIONS = [
  '2 + 3 * 4',
  'sqrt(144)',
  '(5^2 + 3^2) / 2',
  'sin(pi / 6)',
  'log(1000, 10)',
  'derivative(x^3 + 2x, x)',
]

function Solver({ setSteps, setResult, setError, setIsLoading }) {
  const [input, setInput] = useState('')

  const handleSolve = () => {
    if (!input.trim()) {
      setError('Please enter an expression')
      return
    }
    setIsLoading(true)
    setError(null)
    setSteps([])
    setResult(null)

    try {
      const { steps, result } = solveStepByStep(input)
      setSteps(steps)
      setResult(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExample = (expr) => {
    setInput(expr)
    setError(null)
    setSteps([])
    setResult(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSolve()
  }

  const handleClear = () => {
    setInput('')
    setSteps([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="solver-wrapper">
      <div className="input-row">
        <input
          type="text"
          className="math-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 2 + 3 * 4 or derivative(x^2, x)"
          spellCheck={false}
          autoComplete="off"
          maxLength={200}
        />
        <button onClick={handleClear} className="btn btn-clear">C</button>
        <button onClick={handleSolve} className="btn btn-solve">=</button>
      </div>

      <div className="examples">
        <span className="examples-label">Try:</span>
        {EXAMPLE_EXPRESSIONS.map((expr) => (
          <button
            key={expr}
            className="example-chip"
            onClick={() => handleExample(expr)}
          >
            {expr}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Solver