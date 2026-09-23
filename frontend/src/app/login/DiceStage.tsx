"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

/* Grid cells (1–9, row-major) lit on each die face. */
const PIPS: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
}

/* Four Ludo home colours, cycled so each face reads as part of the board. */
const PIP_COLORS = ["#FF5C23", "#FFCE6B", "#4B3FCF", "#E46CFF"]

/** Rotation that brings a given face toward the viewer. */
const FACE_ORIENTATION: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: 0, y: 180 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 },
}

/* Where each face sits on the cube. */
const FACE_TRANSFORM: Record<number, string> = {
  1: "translateZ(2.625rem)",
  2: "rotateY(90deg) translateZ(2.625rem)",
  3: "rotateY(180deg) translateZ(2.625rem)",
  4: "rotateY(-90deg) translateZ(2.625rem)",
  5: "rotateX(90deg) translateZ(2.625rem)",
  6: "rotateX(-90deg) translateZ(2.625rem)",
}

function DieFace({ value }: { value: number }) {
  const cells = PIPS[value]
  return (
    <span className="dice-face" style={{ transform: FACE_TRANSFORM[value] }}>
      {Array.from({ length: 9 }, (_, i) => {
        const cell = i + 1
        const on = cells.includes(cell)
        return (
          <span
            key={cell}
            className={on ? "dice-pip" : ""}
            style={
              on
                ? { backgroundColor: PIP_COLORS[(value + cell) % PIP_COLORS.length] }
                : undefined
            }
          />
        )
      })}
    </span>
  )
}

const PULL_MAX = 110
const PULL_TRIGGER = 52
const ROLL_MS = 1500

/**
 * Dice-roll reveal for the sign-in page.
 *
 * The page opens dim. A die hangs on a cord; pull it, and the die tumbles,
 * lands on a face, and the light comes up on the form.
 *
 * Three rules keep the flourish from becoming an obstacle:
 *
 *  - The form is always in the DOM and always interactive. The dim state is
 *    opacity, not `inert` — nobody is ever locked out by an animation.
 *  - Focus anywhere inside the stage lights it. A keyboard or screen-reader
 *    user who tabs straight to the team-code field never has to discover
 *    that there was a cord to pull.
 *  - `prefers-reduced-motion` skips the whole thing and opens lit.
 */
export function DiceStage({ children }: { children: ReactNode }) {
  const [lit, setLit] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [face, setFace] = useState(6)
  const [turns, setTurns] = useState({ x: 0, y: 0 })
  const [pull, setPull] = useState(0)

  const dragFrom = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reduced motion is handled entirely in CSS: the media query in
  // globals.css forces the glow on and the dim off, so nothing here has to
  // reach for `matchMedia` or set state on mount.

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const roll = useCallback(() => {
    if (rolling) return
    setRolling(true)

    const next = 1 + Math.floor(Math.random() * 6)
    setFace(next)
    // Two to four extra whole turns on each axis, so it reads as a throw
    // rather than a slow orientation change.
    setTurns((prev) => ({
      x: prev.x + 360 * (2 + Math.floor(Math.random() * 3)),
      y: prev.y + 360 * (2 + Math.floor(Math.random() * 3)),
    }))

    timer.current = setTimeout(() => {
      setRolling(false)
      setLit(true)
    }, ROLL_MS)
  }, [rolling])

  /* ── Cord drag ── */
  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (rolling) return
    dragFrom.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragFrom.current === null) return
    setPull(Math.max(0, Math.min(PULL_MAX, e.clientY - dragFrom.current)))
  }

  const endDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragFrom.current === null) return
    const travelled = pull
    dragFrom.current = null
    setPull(0)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* Pointer already released. */
    }
    if (travelled >= PULL_TRIGGER) roll()
  }

  const orientation = FACE_ORIENTATION[face]

  return (
    <div
      className={cn("relative min-h-dvh overflow-hidden bg-ludo-plum", lit && "stage-lit")}
      // Tabbing into the form is itself a request to see the form.
      onFocusCapture={() => {
        if (!lit && !rolling) setLit(true)
      }}
    >
      <span className="stage-glow" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-4 py-8 min-h-dvh">
        {/* ── Cord + die ── */}
        <div
          className="dice-stage flex flex-col items-center shrink-0"
          style={{ transform: `translateY(${pull * 0.35}px)` }}
        >
          <span
            aria-hidden="true"
            className="cord-line"
            style={{ height: `${3.5 + pull * 0.06}rem` }}
          />
          <button
            type="button"
            onClick={roll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            aria-label={
              lit ? "Roll the dice again" : "Pull the cord to roll the dice and sign in"
            }
            className="mt-1 cursor-grab active:cursor-grabbing rounded-2xl touch-none disabled:cursor-wait"
            disabled={rolling}
            style={{ transform: `translateY(${pull}px)` }}
          >
            <span
              className="dice block"
              style={{
                transform: `rotateX(${turns.x + orientation.x}deg) rotateY(${turns.y + orientation.y}deg)`,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((v) => (
                <DieFace key={v} value={v} />
              ))}
            </span>
          </button>

          <p
            className={cn(
              "mt-4 text-[11px] font-semibold tracking-wide transition-opacity duration-500",
              lit ? "text-ludo-vanilla/40" : "text-ludo-vanilla/70",
            )}
          >
            {rolling
              ? "Rolling…"
              : lit
                ? `You rolled ${face} — roll again`
                : "Pull the cord to begin"}
          </p>
          {/* Result announced once, not on every frame of the tumble. */}
          <span className="sr-only" role="status">
            {rolling ? "Rolling the dice" : lit ? `Rolled ${face}. Sign-in form ready.` : ""}
          </span>
        </div>

        {/* ── The form ── */}
        <div className="stage-dimmable w-full flex-1 flex items-center justify-center py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
