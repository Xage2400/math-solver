import { useState } from 'react'
import Solver from './components/Solver'
import StepDisplay from './components/StepDisplay'
import './App.css'

function App() {
  const [steps, setSteps] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <main className="app">
      <header className="header">
        <h1 className="title">MathSolver</h1>
        <p className="subtitle">Step-by-step solutions for any expression</p>
      </header>
      <Solver
        setSteps={setSteps}
        setResult={setResult}
        setError={setError}
        setIsLoading={setIsLoading}
      />
      <StepDisplay
        steps={steps}
        result={result}
        error={error}
        isLoading={isLoading}
      />
    </main>
  )
}

export default App