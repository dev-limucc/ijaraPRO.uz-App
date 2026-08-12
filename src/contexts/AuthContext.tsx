'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  telegramId: string
  name: string | null
  username: string | null
  preferredCurrency: string
  preferredLang: string
}

interface AuthContextType {
  user: User | null
  initData: string | null
  login: (user: User, initData: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [initData, setInitData] = useState<string | null>(null)

  useEffect(() => {
    // Try to get user from localStorage
    const storedUser = localStorage.getItem('user')
    const storedInitData = localStorage.getItem('initData')
    if (storedUser && storedInitData) {
      setUser(JSON.parse(storedUser))
      setInitData(storedInitData)
    }
  }, [])

  const login = (userData: User, data: string) => {
    setUser(userData)
    setInitData(data)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('initData', data)
  }

  const logout = () => {
    setUser(null)
    setInitData(null)
    localStorage.removeItem('user')
    localStorage.removeItem('initData')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        initData,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

