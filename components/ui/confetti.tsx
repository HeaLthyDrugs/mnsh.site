"use client"

import type { ReactNode } from "react"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti"

import { Button } from "@/components/ui/button"

type Api = {
  fire: (options?: ConfettiOptions) => void
}

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
  manualstart?: boolean
  children?: ReactNode
}

export type ConfettiRef = Api | null

const ConfettiContext = createContext<Api>({} as Api)

const DEFAULT_GLOBAL_OPTIONS: ConfettiGlobalOptions = { resize: true, useWorker: true }

type ConfettiModule = typeof import("canvas-confetti")
type ConfettiFn = ConfettiModule extends { default: infer T } ? T : ConfettiModule

let confettiLoader: Promise<ConfettiFn> | null = null

async function loadConfetti(): Promise<ConfettiFn | null> {
  if (typeof window === "undefined") return null
  if (!confettiLoader) {
    confettiLoader = import("canvas-confetti").then(
      (module) => ("default" in module ? module.default : module) as ConfettiFn
    )
  }
  return confettiLoader
}

const HEART_CONFETTI_VARIANTS: ConfettiOptions[] = [
  {
    particleCount: 70,
    startVelocity: 45,
    spread: 70,
    scalar: 1.1,
    gravity: 1,
    decay: 0.92,
    ticks: 180,
    colors: ["#ef4444", "#f43f5e", "#fb7185"],
  },
  {
    particleCount: 90,
    startVelocity: 36,
    spread: 110,
    scalar: 0.95,
    gravity: 0.9,
    drift: 0.3,
    decay: 0.9,
    ticks: 220,
    colors: ["#dc2626", "#ec4899", "#fda4af"],
  },
  {
    particleCount: 65,
    startVelocity: 55,
    spread: 55,
    scalar: 1.25,
    gravity: 1.2,
    decay: 0.94,
    ticks: 160,
    colors: ["#b91c1c", "#e11d48", "#f43f5e"],
  },
]

export function getNextHeartConfettiVariant(previousVariant: number | null) {
  const variantCount = HEART_CONFETTI_VARIANTS.length
  let nextVariant = Math.floor(Math.random() * variantCount)

  if (variantCount > 1 && previousVariant !== null && nextVariant === previousVariant) {
    nextVariant = (nextVariant + 1) % variantCount
  }

  return {
    variant: nextVariant,
    options: HEART_CONFETTI_VARIANTS[nextVariant],
  }
}

// Define component first
const ConfettiComponent = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = DEFAULT_GLOBAL_OPTIONS,
    manualstart = false,
    children,
    ...rest
  } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)
  const canvasNodeRef = useRef<HTMLCanvasElement | null>(null)

  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasNodeRef.current = node
      if (node === null && instanceRef.current) {
        instanceRef.current.reset()
        instanceRef.current = null
      }
    },
    []
  )

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (instanceRef.current || !canvasNodeRef.current) return
      const confetti = await loadConfetti()
      if (!confetti || cancelled || !canvasNodeRef.current) return

      instanceRef.current = confetti.create(canvasNodeRef.current, {
        ...globalOptions,
        resize: true,
      })
    }

    void init()

    return () => {
      cancelled = true
      if (instanceRef.current) {
        instanceRef.current.reset()
        instanceRef.current = null
      }
    }
  }, [globalOptions])

  const fire = useCallback(
    async (opts = {}) => {
      try {
        await instanceRef.current?.({ ...options, ...opts })
      } catch (error) {
        console.error("Confetti error:", error)
      }
    },
    [options]
  )

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire]
  )

  useImperativeHandle(ref, () => api, [api])

  useEffect(() => {
    if (!manualstart) {
      ;(async () => {
        try {
          await fire()
        } catch (error) {
          console.error("Confetti effect error:", error)
        }
      })()
    }
  }, [manualstart, fire])

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  )
})

// Set display name immediately
ConfettiComponent.displayName = "Confetti"

// Export as Confetti
export const Confetti = ConfettiComponent

interface ConfettiButtonProps extends React.ComponentProps<"button"> {
  options?: ConfettiOptions &
    ConfettiGlobalOptions & { canvas?: HTMLCanvasElement }
}

const ConfettiButtonComponent = ({
  options,
  children,
  ...props
}: ConfettiButtonProps) => {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const confetti = await loadConfetti()
      if (!confetti) return

      const rect = event.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      await confetti({
        ...options,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      })
    } catch (error) {
      console.error("Confetti button error:", error)
    }
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

ConfettiButtonComponent.displayName = "ConfettiButton"

export const ConfettiButton = ConfettiButtonComponent

