"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch {
      // If error, keep initial value
    }
    setIsHydrated(true)
  }, [key])

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value
        try {
        } catch {
          // localStorage full or unavailable
        }
        return valueToStore
      })
    },
    [key]
  )

  return [storedValue, setValue, isHydrated] as const
}
