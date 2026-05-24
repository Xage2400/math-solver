import { useRef, useState, useEffect } from 'react'
import { solveExpression } from '../utils/mathSolver'
import * as tf from '@tensorflow/tfjs'

const CANVAS_SIZE = 280
const MAX_CANVAS_BYTES = CANVAS_SIZE * CANVAS_SIZE * 4

const OPERATORS = ['+', '-', '×', '÷', '(', ')', 'C', '⌫']

async function loadMNIST() {
  const model = await tf.loadLayersModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json'
  )
  return model
}

function preprocessCanvas(canvas) {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(canvas, 1)
    tensor = tf.image.resizeBilinear(tensor, [28, 28])
    tensor = tf.scalar(255).sub(tensor)
    tensor = tensor.div(tf.scalar(255))
    tensor = tensor.reshape([1, 28, 28, 1])
    return tensor
  })
}

function Canvas({ setResult, setExpression, setIsLoading, setError }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const [model, setModel] = useState(null)
  const [modelReady, setModelReady] = useState(false)
  const [expression, setLocalExpression] = useState('')

  useEffect(() => {
    resetCanvas()
    loadMNIST()
      .then((m) => {
        setModel(m)
        setModelReady(true)
      })
      .catch(() => setError('Failed to load ML model. Please refresh.'))
  }, [])

  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 16
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setHasContent(false)
  }

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_SIZE / rect.width
    const scaleY = CANVAS_SIZE / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: Math.min(Math.max((clientX - rect.left) * scaleX, 0), CANVAS_SIZE),
      y: Math.min(Math.max((clientY - rect.top) * scaleY, 0), CANVAS_SIZE),
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasContent(true)
    setError(null)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(false)
  }

  const handleOperator = (op) => {
    if (op === 'C') {
      setLocalExpression('')
      setResult(null)
      setExpression('')
      setError(null)
      resetCanvas()
      return
    }
    if (op === '⌫') {
      setLocalExpression((prev) => prev.slice(0, -1))
      return
    }
    const symbol = op === '×' ? '*' : op === '÷' ? '/' : op
    setLocalExpression((prev) => prev + symbol)
  }

  const handleAddDigit = async () => {
    if (!hasContent) {
      setError('Draw a digit first!')
      return
    }
    if (!modelReady) {
      setError('Model still loading...')
      return
    }

    const canvas = canvasRef.current
    const imageData = canvas.getContext('2d').getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    if (imageData.data.length > MAX_CANVAS_BYTES) {
      setError('Canvas data exceeds safe limit.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const tensor = preprocessCanvas(canvas)
      const predictions = model.predict(tensor)
      const predArray = predictions.dataSync()
      const digit = predArray.indexOf(Math.max(...predArray))
      const confidence = predArray[digit]

      tensor.dispose()
      predictions.dispose()

      if (confidence < 0.5) {
        setError(`Low confidence (${Math.round(confidence * 100)}%). Try drawing larger and clearer.`)
        return
      }

      setLocalExpression((prev) => prev + String(digit))
      resetCanvas()
    } catch (err) {
      setError('Could not recognise digit. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSolve = () => {
    if (!expression.trim()) {
      setError('Build an expression first!')
      return
    }
    try {
      const { expression: expr, result } = solveExpression(expression)
      setExpression(expr)
      setResult(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="canvas-wrapper">
      <div className="expression-bar">
        <span className="expression-text">{expression || <span className="placeholder">Draw digits, add operators...</span>}</span>
      </div>

      <div className="model-status">
        {modelReady
          ? <span className="status-ready">● Model ready</span>
          : <span className="status-loading">● Loading model...</span>
        }
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <button
        onClick={handleAddDigit}
        className="btn btn-add-digit"
        disabled={!modelReady || !hasContent}
      >
        + Add Digit
      </button>

      <div className="operators">
        {OPERATORS.map((op) => (
          <button
            key={op}
            onClick={() => handleOperator(op)}
            className={`btn btn-op ${op === 'C' ? 'btn-clear' : ''}`}
          >
            {op}
          </button>
        ))}
      </div>

      <button onClick={handleSolve} className="btn btn-solve">
        Solve
      </button>
    </div>
  )
}

export default Canvas