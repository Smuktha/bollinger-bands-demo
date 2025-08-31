export type BollInput = {
  length: number
  multiplier: number
  offset: number
}

// Population standard deviation (divide by N)
export function stdDev(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

export function sma(values: number[], length: number): (number | undefined)[] {
  const out: (number | undefined)[] = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= length) {
      sum -= values[i - length]
    }
    if (i >= length - 1) out.push(sum / length)
    else out.push(undefined)
  }
  return out
}

export function calculateBollinger(closes: number[], opts: BollInput) {
  const L = opts.length
  const ma = sma(closes, L)
  const result: ({ basis: number, upper: number, lower: number } | undefined)[] = Array(closes.length).fill(undefined)

  for (let i = 0; i < closes.length; i++) {
    if (i >= L - 1) {
      const window = closes.slice(i - L + 1, i + 1)
      const basis = ma[i]!  // defined when i >= L-1
      const sd = stdDev(window)
      const upper = basis + opts.multiplier * sd
      const lower = basis - opts.multiplier * sd
      result[i] = { basis, upper, lower }
    }
  }

  // Apply offset: shift by N bars forward (positive == future shift)
  const { offset } = opts
  if (offset !== 0) {
    const shifted: typeof result = Array(result.length).fill(undefined)
    for (let i = 0; i < result.length; i++) {
      const j = i + offset
      if (j >= 0 && j < result.length) shifted[j] = result[i]
    }
    return shifted
  }
  return result
}

// small util to convert hex to rgba
export function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace('#', '')
  const bigint = parseInt(m, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
