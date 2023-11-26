import { useEffect, useRef, useState } from "react";

type Options = {
  forceLoadDuration: number
  skipLoad: number
}

type states = 'pre' | 'middle' | 'end' | undefined

export const useDelayedLoad = (trpcLoading: boolean, options?: Options) => {
  const [started, setStarted] = useState<states>();
  const ref = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!trpcLoading && started === 'pre') {
      clearTimeout(ref.current)
      setStarted(undefined)
    }

    if (trpcLoading && !started && !ref.current) {
      setStarted('pre')
      ref.current = setTimeout(() => {
        setStarted('middle')
        ref.current = setTimeout(() => {
          setStarted(undefined)
        }, options?.forceLoadDuration || 1500)
      }, options?.skipLoad || 1000)
    }
  }, [trpcLoading, started])

  if (!started || started === "pre") return false
  if (started === "middle") return true
  return trpcLoading
}
