"use client"

import { useCallback, useSyncExternalStore } from 'react'

/**
 * A boolean preference backed by localStorage.
 *
 * Reading localStorage in an effect and calling setState works, but it is a
 * cascading render and React 19's lint flags it. `useSyncExternalStore` is
 * the primitive built for exactly this: the server snapshot is the default,
 * the client snapshot is whatever is stored, and React reconciles the two
 * after hydration without a mismatch warning.
 */

type Listener = () => void

const listeners = new Map<string, Set<Listener>>()
const cache = new Map<string, boolean>()

function read(key: string, fallback: boolean): boolean {
  if (cache.has(key)) return cache.get(key)!
  let value = fallback
  try {
    const stored = window.localStorage.getItem(key)
    if (stored !== null) value = stored === 'true'
  } catch {
    /* Private mode or blocked storage — fall back to the default. */
  }
  cache.set(key, value)
  return value
}

function write(key: string, value: boolean) {
  cache.set(key, value)
  try {
    window.localStorage.setItem(key, String(value))
  } catch {
    /* Non-fatal: the preference just will not survive a reload. */
  }
  listeners.get(key)?.forEach((listener) => listener())
}

export function useStoredFlag(
  key: string,
  fallback = false,
): [boolean, (value: boolean) => void] {
  const subscribe = useCallback(
    (onStoreChange: Listener) => {
      let set = listeners.get(key)
      if (!set) {
        set = new Set()
        listeners.set(key, set)
      }
      set.add(onStoreChange)

      // Keeps other tabs in step.
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache.delete(key)
          onStoreChange()
        }
      }
      window.addEventListener('storage', onStorage)

      return () => {
        set.delete(onStoreChange)
        window.removeEventListener('storage', onStorage)
      }
    },
    [key],
  )

  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  )

  const setValue = useCallback((next: boolean) => write(key, next), [key])

  return [value, setValue]
}
