/**
 * 轻量性能测量：优先 Performance API，降级为 Date.now
 */
export function createPerfMark(label) {
  const markName = `dop:${label}:${Date.now()}`
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(markName)
    return markName
  }
  return null
}

export function measureBetween(startMark, endLabel) {
  const measureName = `dop:${endLabel}`
  if (
    typeof performance !== 'undefined' &&
    performance.measure &&
    startMark &&
    performance.getEntriesByName(startMark).length
  ) {
    const endMark = createPerfMark(endLabel)
    performance.measure(measureName, startMark, endMark)
    const entry = performance.getEntriesByName(measureName).pop()
    return entry?.duration ?? 0
  }
  return 0
}

export function runTimed(label, fn) {
  const start = performance?.now?.() ?? Date.now()
  const result = fn()
  const end = performance?.now?.() ?? Date.now()
  return {
    label,
    durationMs: Math.round((end - start) * 100) / 100,
    result,
  }
}
