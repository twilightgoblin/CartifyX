"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { dataService } from "./data-service"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = dataService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const authUser = await dataService.login(credentials)
      setUser(authUser)
    } catch (error) {
      throw error
    }
  }

  const signup = async (credentials) => {
    try {
      const authUser = await dataService.signup(credentials)
      setUser(authUser)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    dataService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
