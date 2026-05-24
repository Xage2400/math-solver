import * as math from 'mathjs'

const SAFE_EXPRESSION = /^[a-zA-Z0-9+\-*/^().,%\s!]+$/

export function validateExpression(expression) {
  if (!expression || expression.trim() === '') {
    throw new Error('Please enter an expression')
  }
  if (expression.length > 200) {
    throw new Error('Expression is too long')
  }
  if (!SAFE_EXPRESSION.test(expression)) {
    throw new Error('Expression contains invalid characters')
  }
}

export function solveStepByStep(expression) {
  validateExpression(expression)

  const steps = []
  const sanitized = expression.trim()

  try {
    // Step 1 — parse and show the original
    const node = math.parse(sanitized)
    steps.push({
      label: 'Input',
      detail: node.toString(),
      type: 'input'
    })

    // Step 2 — check for derivative
    const derivMatch = sanitized.match(/^derivative\s*\(\s*(.+)\s*,\s*([a-zA-Z])\s*\)$/)
    if (derivMatch) {
      const expr = derivMatch[1]
      const variable = derivMatch[2]
      const derived = math.derivative(expr, variable)
      steps.push({
        label: `Differentiate with respect to ${variable}`,
        detail: `d/d${variable} [${expr}]`,
        type: 'step'
      })
      steps.push({
        label: 'Result',
        detail: derived.toString(),
        type: 'result'
      })
      return { steps, result: derived.toString(), isSymbolic: true }
    }

    // Step 3 — check for algebraic simplification
    const simplified = math.simplify(sanitized)
    const simplifiedStr = simplified.toString()
    if (simplifiedStr !== sanitized) {
      steps.push({
        label: 'Simplify',
        detail: simplifiedStr,
        type: 'step'
      })
    }

// Step 4 — evaluate if numeric
    try {
      // Explicitly check for division by zero before evaluating
      if (/\/\s*0(?![.\d])/.test(sanitized)) {
        throw new Error('Cannot divide by zero')
      }

      const result = math.evaluate(sanitized)

      if (typeof result === 'number') {
        if (!isFinite(result)) throw new Error('Cannot divide by zero')

        const hasMultipleOps = /[+\-*/^]/.test(sanitized.replace(/^\-/, ''))
        if (hasMultipleOps) {
          steps.push({
            label: 'Apply order of operations (BODMAS)',
            detail: `Evaluating: ${simplifiedStr !== sanitized ? simplifiedStr : sanitized}`,
            type: 'step'
          })
        }

        const rounded = Math.round(result * 1e10) / 1e10
        steps.push({
          label: 'Result',
          detail: String(rounded),
          type: 'result'
        })

        return { steps, result: String(rounded), isSymbolic: false }
      }

      steps.push({
        label: 'Result',
        detail: math.format(result, { precision: 10 }),
        type: 'result'
      })

      return {
        steps,
        result: math.format(result, { precision: 10 }),
        isSymbolic: false
      }

    } catch (evalErr) {
      if (
        evalErr.message.includes('Cannot divide by zero') ||
        evalErr.message.includes('Infinity')
      ) {
        throw new Error('Cannot divide by zero')
      }

      steps.push({
        label: 'Symbolic expression',
        detail: simplifiedStr,
        type: 'result'
      })
      return { steps, result: simplifiedStr, isSymbolic: true }
    }

  } catch (err) {
    if (err.message.includes('division by zero') || err.message.includes('Infinity')) {
      throw new Error('Cannot divide by zero')
    }
    throw new Error(err.message || 'Could not parse expression')
  }
}