"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | null>(null)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "123"

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const login = useCallback((password: string) => {
    console.log("[v0] ADMIN_PASSWORD env value:", JSON.stringify(ADMIN_PASSWORD))
    console.log("[v0] User entered password:", JSON.stringify(password))
    console.log("[v0] Match:", password === ADMIN_PASSWORD)
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
