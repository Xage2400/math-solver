function ResultDisplay({ result, expression, isLoading, error }) {
    if (isLoading) {
      return (
        <div className="result-wrapper loading">
          <div className="spinner" />
          <p>Analysing your equation...</p>
        </div>
      )
    }
  
    if (error) {
      return (
        <div className="result-wrapper error">
          <p className="error-message">⚠️ {error}</p>
        </div>
      )
    }
  
    if (result === null) {
      return (
        <div className="result-wrapper empty">
          <p className="hint">Draw an equation above and hit Solve</p>
        </div>
      )
    }
  
    return (
      <div className="result-wrapper">
        <div className="expression">
          <span className="label">Detected:</span>
          <span className="value">{expression}</span>
        </div>
        <div className="result">
          <span className="label">Answer:</span>
          <span className="value answer">{String(result)}</span>
        </div>
      </div>
    )
  }
  
  export default ResultDisplay
