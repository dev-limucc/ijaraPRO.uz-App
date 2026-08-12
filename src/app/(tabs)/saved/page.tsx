'use client'
import { useEffect, useState } from 'react'
import { ListingCard } from '@/components/ui/ListingCard'
import { useAuth } from '@/contexts/AuthContext'
import { Listing } from '@/types'
import { LoginModal } from '@/components/modals/LoginModal'

export default function SavedPage() {
  const { user, initData, isAuthenticated } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedListings()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchSavedListings = async () => {
    try {
      setLoading(true)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (initData) {
        headers.Authorization = JSON.stringify({ initData })
      }

      // Get all listings and filter favorites
      const res = await fetch('/api/listings', { headers })
      if (res.ok) {
        const { listings: allListings } = await res.json()
        const saved = allListings.filter((l: Listing) => l.isFavorite)
        setListings(saved)
      }
    } catch (error) {
      console.error('Error fetching saved listings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Saved Listings</h2>
            <p className="text-gray-600 mb-6">
              Please log in to view your saved listings.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
            >
              Login with Telegram
            </button>
          </div>
        </div>
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={fetchSavedListings}
          />
        )}
      </>
    )
  }

  const userCurrency = user?.preferredCurrency || 'UZS'

  return (
    <div className="min-h-screen pb-4">
      <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Saved Listings</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No saved listings yet
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                userCurrency={userCurrency}
                onFavoriteToggle={fetchSavedListings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

