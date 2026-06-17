/**
 * 节流：在 wait 毫秒内最多执行一次 fn
 */
export function throttle(fn, wait = 100) {
  let lastTime = 0
  let timer = null

  function invoke(...args) {
    lastTime = Date.now()
    fn(...args)
  }

  return function throttled(...args) {
    const now = Date.now()
    const remaining = wait - (now - lastTime)

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      invoke(...args)
      return
    }

    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        invoke(...args)
      }, remaining)
    }
  }
}

/**
 * 防抖：停止触发 wait 毫秒后执行 fn
 */
export function debounce(fn, wait = 200) {
  let timer = null

  return function debounced(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, wait)
  }
}
