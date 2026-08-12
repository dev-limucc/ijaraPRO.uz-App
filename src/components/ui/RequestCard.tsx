'use client'
import { formatPrice, convertCurrency } from '@/lib/currency'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { LoginModal } from '@/components/modals/LoginModal'

interface RequestCardProps {
  request: {
    id: string
    budget: number
    currency: string
    city: string | null
    propertyType: string | null
    note: string | null
    _count?: {
      likes: number
      watchers: number
    }
    isLiked?: boolean
    isWatched?: boolean
  }
  userCurrency?: string
  onLikeToggle?: () => void
  onWatchToggle?: () => void
}

export function RequestCard({
  request,
  userCurrency = 'UZS',
  onLikeToggle,
  onWatchToggle,
}: RequestCardProps) {
  const { isAuthenticated, initData } = useAuth()
  const [isLiked, setIsLiked] = useState(request.isLiked || false)
  const [isWatched, setIsWatched] = useState(request.isWatched || false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const convertedPrice = convertCurrency(
    request.budget,
    request.currency,
    userCurrency
  )
  const displayPrice = formatPrice(convertedPrice, userCurrency)

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      const res = await fetch(`/api/requests/${request.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
      })

      if (res.ok) {
        const { isLiked: newLiked } = await res.json()
        setIsLiked(newLiked)
        if (onLikeToggle) onLikeToggle()
      }
    } catch (error) {
      console.error('Like toggle error:', error)
    }
  }

  const handleWatchClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      const res = await fetch(`/api/requests/${request.id}/watch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
      })

      if (res.ok) {
        const { isWatched: newWatched } = await res.json()
        setIsWatched(newWatched)
        if (onWatchToggle) onWatchToggle()
      }
    } catch (error) {
      console.error('Watch toggle error:', error)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[280px]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="text-teal-600 font-bold text-lg mb-1">
              {displayPrice}
            </div>
            {request.city && (
              <div className="text-gray-600 text-sm mb-1">📍 {request.city}</div>
            )}
            {request.propertyType && (
              <div className="text-gray-600 text-sm">
                🏠 {request.propertyType}
              </div>
            )}
          </div>
        </div>
        {request.note && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {request.note}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 ${
                isLiked ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <span>❤️</span>
              <span className="text-sm">
                {request._count?.likes || 0}
              </span>
            </button>
            <button
              onClick={handleWatchClick}
              className={`${isWatched ? 'text-teal-500' : 'text-gray-400'}`}
            >
              🔔
            </button>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => setShowLoginModal(false)}
        />
      )}
    </>
  )
}

