/**
 * Minimal Chrome DevTools Protocol client.
 *
 * Node 22+ ships a global WebSocket, so driving a real browser needs no
 * dependency at all — which matters here, because the whole point of these
 * suites is that they run against the built app in a real engine rather
 * than against jsdom.
 */

export async function connect(port) {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  const target = targets.find((t) => t.type === 'page')
  if (!target) throw new Error('No page target on the debugging port')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = () => reject(new Error('Could not open the CDP socket'))
  })

  let id = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
    }
  }

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgId = ++id
      pending.set(msgId, { resolve, reject })
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })

  await send('Page.enable')
  await send('Runtime.enable')

  return { ws, send }
}

export function makeDriver({ send }, site) {
  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
    }
    return result.value
  }

  const pause = (ms) => new Promise((r) => setTimeout(r, ms))

  const goto = async (path, wait = 1200) => {
    await send('Page.navigate', { url: site + path })
    await pause(wait)
  }

  const viewport = (width, height, mobile = width < 900) =>
    send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    })

  const emulate = (features) => send('Emulation.setEmulatedMedia', { features })

  return {
    send,
    evaluate,
    pause,
    goto,
    viewport,
    emulate,
    text: () => evaluate('document.body.innerText'),
    path: () => evaluate('location.pathname'),
    /** React-safe value setter: bypasses the value setter React patches in. */
    setValue: (selector, value) =>
      evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
        d.set.call(el, ${JSON.stringify(value)});
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      })()`),
    /** Clicks the first element whose text contains `label`. */
    clickText: (label, tag = 'button') =>
      evaluate(`(() => {
        const el = [...document.querySelectorAll(${JSON.stringify(tag)})]
          .find(b => b.textContent.trim().toLowerCase().includes(${JSON.stringify(label.toLowerCase())}));
        if (!el) return false;
        el.click();
        return true;
      })()`),
    store: async () =>
      JSON.parse(
        (await evaluate(`localStorage.getItem('playora:tournament:v1') || 'null'`)) ??
          'null',
      ),
  }
}

/** Tiny assertion recorder so every suite reports the same way. */
export function makeReporter(suiteName) {
  const failures = []
  let passes = 0

  return {
    section: (title) => console.log('\n  ' + title),
    check: (label, ok, detail = '') => {
      if (ok) {
        passes += 1
        console.log('    ok    ' + label)
      } else {
        failures.push(label + (detail ? ' - ' + detail : ''))
        console.log('    FAIL  ' + label + (detail ? '\n            ' + detail : ''))
      }
    },
    finish: () => {
      console.log(`\n  ${suiteName}: ${passes} passed, ${failures.length} failed`)
      return { passes, failures }
    },
  }
}

/**
 * Admin credentials for the suites.
 *
 * Deliberately no fallback value. A default here would put a real password
 * in the git history, which is exactly what keeping them in `.env.local`
 * was meant to avoid. `run.mjs` loads `.env.local` (gitignored) before
 * importing this module, so local runs still need no setup.
 */
export const ADMIN_EMAIL = process.env.PLAYORA_ADMIN_EMAIL ?? ''
export const ADMIN_PASSWORD = process.env.PLAYORA_ADMIN_PASSWORD ?? ''

/** Signs into the admin console. Every admin suite needs this first. */
export async function signInAdmin(d) {
  await d.goto('/login')
  await d.clickText('Admin')
  await d.pause(300)
  await d.setValue('input[name="email"]', ADMIN_EMAIL)
  await d.setValue('input[name="password"]', ADMIN_PASSWORD)
  await d.evaluate(`document.querySelector('form button[type="submit"]').click()`)
  await d.pause(1700)
}
