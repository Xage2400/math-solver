function StepDisplay({ steps, result, error, isLoading }) {
    if (isLoading) {
      return (
        <div className="step-display loading">
          <div className="spinner" />
          <p>Solving...</p>
        </div>
      )
    }
  
    if (error) {
      return (
        <div className="step-display error">
          <p className="error-message">⚠️ {error}</p>
        </div>
      )
    }
  
    if (!steps.length) {
      return (
        <div className="step-display empty">
          <p className="hint">Enter an expression above and hit <strong>=</strong> to solve</p>
          <ul className="supported">
            <li>✓ Arithmetic & BODMAS</li>
            <li>✓ Powers, roots & logarithms</li>
            <li>✓ Trigonometry</li>
            <li>✓ Simplification</li>
            <li>✓ Derivatives</li>
            <li>✓ Matrices & complex numbers</li>
          </ul>
        </div>
      )
    }
  
    return (
      <div className="step-display">
        <h2 className="steps-title">Solution</h2>
        <div className="steps-list">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`step-item step-${step.type}`}
            >
              <span className="step-number">{i + 1}</span>
              <div className="step-content">
                <span className="step-label">{step.label}</span>
                <span className="step-detail">{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
        {result && (
          <div className="final-result">
            <span className="final-label">Answer</span>
            <span className="final-value">{result}</span>
          </div>
        )}
      </div>
    )
  }
  
  export default StepDisplay