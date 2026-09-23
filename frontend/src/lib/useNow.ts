"use client"

import { useSyncExternalStore } from 'react'

/**
 * A once-a-second clock shared by every live match card on the page.
 *
 * Two reasons this is an external store rather than `useState` + an effect:
 *
 *  - Setting state from an effect on mount is a cascading render, and React
 *    19's lint rejects it.
 *  - The server has no idea what time it is on the viewer's device. The
 *    server snapshot is `null`, so SSR renders a placeholder and the real
 *    duration appears on the client with no hydration mismatch.
 *
 * One interval is shared by all subscribers and is cleared when the last
 * one unmounts, so a page with six live matches still ticks once a second.
 */

let now = Date.now()
let timer: ReturnType<typeof setInterval> | null = null
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  if (timer === null) {
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((l) => l())
    }, 1000)
  }
  return () => {
    listeners.delete(onChange)
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }
}

/** Current epoch milliseconds, or `null` while rendering on the server. */
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  )
}
