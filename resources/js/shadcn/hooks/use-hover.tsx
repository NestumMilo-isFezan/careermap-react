import { useState, useCallback, useRef } from 'react'

export function useHover<T extends HTMLElement = HTMLElement>(
  delayEnter = 0,
  delayLeave = 0
) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<T>(null)
  const enterTimeout = useRef<NodeJS.Timeout>()
  const leaveTimeout = useRef<NodeJS.Timeout>()

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimeout.current)
    enterTimeout.current = setTimeout(() => setIsHovered(true), delayEnter)
  }, [delayEnter])

  const handleMouseLeave = useCallback(() => {
    clearTimeout(enterTimeout.current)
    leaveTimeout.current = setTimeout(() => setIsHovered(false), delayLeave)
  }, [delayLeave])

  return { ref, isHovered, handleMouseEnter, handleMouseLeave }
}
