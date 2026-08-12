'use client'
import { useEffect, useState } from 'react'
import { ListingCard } from '@/components/ui/ListingCard'
import { YandexMap } from '@/components/maps/YandexMap'
import { useAuth } from '@/contexts/AuthContext'
import { Listing } from '@/types'

export default function SearchPage() {
  const { user, initData } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [city, setCity] = useState('')
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.3111, 69.2797]) // Tashkent default

  useEffect(() => {
    // Try to get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter([latitude, longitude])
          fetchNearbyListings(latitude, longitude)
        },
        () => {
          // User denied or error, fetch all listings
          fetchAllListings()
        }
      )
    } else {
      fetchAllListings()
    }
  }, [])

  const fetchAllListings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/listings')
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

  const handleSearch = () => {
    if (city) {
      fetch(`/api/listings?city=${encodeURIComponent(city)}`)
        .then((res) => res.json())
        .then((data) => setListings(data.listings))
        .catch(console.error)
    } else {
      fetchAllListings()
    }
  }

  const handleMapLocationChange = (lat: number, lng: number) => {
    setMapCenter([lat, lng])
    fetchNearbyListings(lat, lng)
  }

  const markers = listings
    .filter((l) => l.latitude && l.longitude)
    .map((l) => ({
      lat: l.latitude!,
      lng: l.longitude!,
      title: l.title,
    }))

  const userCurrency = user?.preferredCurrency || 'UZS'

  return (
    <div className="min-h-screen pb-4">
      <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-200">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleSearch}
            className="bg-teal-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-600 transition-colors"
          >
            Search
          </button>
        </div>
        <input
          type="text"
          placeholder="City (optional)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="p-4">
        <div className="mb-4">
          <YandexMap
            center={mapCenter}
            markers={markers}
            onLocationChange={handleMapLocationChange}
            height="300px"
          />
        </div>

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
                onFavoriteToggle={fetchAllListings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

