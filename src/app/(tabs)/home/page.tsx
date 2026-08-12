'use client'
import { useEffect, useState } from 'react'
import { ListingCard } from '@/components/ui/ListingCard'
import { RequestCard } from '@/components/ui/RequestCard'
import { useAuth } from '@/contexts/AuthContext'
import { Listing, Request } from '@/types'

export default function HomePage() {
  const { user, initData } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  useEffect(() => {
    fetchLatestListings()
    fetchPopularRequests()
  }, [])

  const fetchLatestListings = async () => {
    try {
      const res = await fetch('/api/listings/latest')
      if (res.ok) {
        const { listings: data } = await res.json()
        setListings(data)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularRequests = async () => {
    try {
      const headers: HeadersInit = {}
      if (initData) {
        headers.Authorization = JSON.stringify({ initData })
      }
      const res = await fetch('/api/requests', { headers })
      if (res.ok) {
        const { requests: data } = await res.json()
        setRequests(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          fetchNearbyListings(latitude, longitude)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  const fetchNearbyListings = async (lat: number, lng: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/listings?lat=${lat}&lng=${lng}`)
      if (res.ok) {
        const { listings: data } = await res.json()
        setListings(data)
      }
    } catch (error) {
      console.error('Error fetching nearby listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const userCurrency = user?.preferredCurrency || 'UZS'

  return (
    <div className="min-h-screen pb-4">
      <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">📍 Near you</h1>
          <button
            onClick={handleNearMe}
            className="bg-teal-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-600 transition-colors"
          >
            Near me
          </button>
        </div>
      </div>

      <div className="p-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Latest listings near you
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No listings found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  userCurrency={userCurrency}
                  onFavoriteToggle={fetchLatestListings}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Popular requests</h2>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-2">
                {requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    userCurrency={userCurrency}
                    onLikeToggle={fetchPopularRequests}
                    onWatchToggle={fetchPopularRequests}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

