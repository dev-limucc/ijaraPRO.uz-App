'use client'
import { formatPrice, convertCurrency } from '@/lib/currency'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { LoginModal } from '@/components/modals/LoginModal'

interface ListingCardProps {
  listing: {
    id: string
    title: string
    description: string | null
    price: number
    currency: string
    city: string | null
    images: string[] | null
    isFavorite?: boolean
    user?: {
      name: string | null
      username: string | null
    }
  }
  userCurrency?: string
  onFavoriteToggle?: () => void
}

export function ListingCard({
  listing,
  userCurrency = 'UZS',
  onFavoriteToggle,
}: ListingCardProps) {
  const { isAuthenticated, initData } = useAuth()
  const [isFavorite, setIsFavorite] = useState(listing.isFavorite || false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const convertedPrice = convertCurrency(
    listing.price,
    listing.currency,
    userCurrency
  )
  const displayPrice = formatPrice(convertedPrice, userCurrency)

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      const res = await fetch(`/api/favorites/${listing.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
      })

      if (res.ok) {
        const { isFavorite: newFavorite } = await res.json()
        setIsFavorite(newFavorite)
        if (onFavoriteToggle) onFavoriteToggle()
      }
    } catch (error) {
      console.error('Favorite toggle error:', error)
    }
  }

  const firstImage =
    listing.images && Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images[0]
      : null

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {firstImage && (
          <div className="relative w-full h-48 bg-gray-200">
            <img
              src={firstImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg flex-1">{listing.title}</h3>
            <button
              onClick={handleFavoriteClick}
              className={`ml-2 text-2xl ${
                isFavorite ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
          {listing.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {listing.description}
            </p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-teal-600 font-bold text-lg">
              {displayPrice}
            </span>
            {listing.city && (
              <span className="text-gray-500 text-sm">📍 {listing.city}</span>
            )}
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

