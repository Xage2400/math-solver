import Tesseract from 'tesseract.js'

let worker = null

export async function loadModel() {
  if (worker) return worker

  worker = await Tesseract.createWorker('eng', 1, {
    logger: () => {}, // silence logs
  })

  await worker.setParameters({
    tessedit_char_whitelist: '0123456789+-*/(). ', // security: only allow math characters
  })

  return worker
}

export async function preprocessCanvas(canvas) {
  // Return canvas as blob for Tesseract
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Failed to convert canvas to blob'))
      else resolve(blob)
    }, 'image/png')
  })
}

export async function getTopPrediction(worker, imageBlob) {
  const { data } = await worker.recognize(imageBlob)
  const text = data.text
    .trim()
    .replace(/\s+/g, ' ')        // normalise whitespace
    .replace(/[xX×]/g, '*')      // convert multiplication symbols
    .replace(/[÷]/g, '/')        // convert division symbols
    .replace(/[^0-9+\-*/().\s]/g, '') // strip anything else
  
  return { text, confidence: data.confidence }
}