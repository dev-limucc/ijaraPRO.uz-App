'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onLogin: () => void
}

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const { login } = useAuth()

  useEffect(() => {
    // Initialize Telegram WebApp SDK
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
    }
  }, [])

  const handleTelegramLogin = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp
        const initData = tg.initData

        if (!initData) {
          alert('Telegram WebApp not available. Please open in Telegram.')
          return
        }

        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        })

        if (res.ok) {
          const { user } = await res.json()
          login(user, initData)
          onLogin()
          onClose()
        } else {
          alert('Login failed. Please try again.')
        }
      } else {
        // Fallback for development/testing
        const testInitData = 'user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Test%22%7D&hash=test'
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData: testInitData }),
        })
        if (res.ok) {
          const { user } = await res.json()
          login(user, testInitData)
          onLogin()
          onClose()
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          Please log in via Telegram to continue.
        </p>
        <button
          onClick={handleTelegramLogin}
          className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
        >
          Login with Telegram
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-500 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

