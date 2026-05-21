"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "shield-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFavorites(new Set(JSON.parse(stored) as string[]))
    } catch {}
  }, [])

  const toggle = useCallback((href: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href)
      else next.add(href)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [])

  return { favorites, toggle }
}
