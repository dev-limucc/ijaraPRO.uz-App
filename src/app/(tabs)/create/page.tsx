'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginModal } from '@/components/modals/LoginModal'
import { YandexMap } from '@/components/maps/YandexMap'
import { useRouter } from 'next/navigation'

export default function CreateListingPage() {
  const { user, initData, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    images: [] as string[],
  })
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.3111, 69.2797])

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Create Listing</h2>
            <p className="text-gray-600 mb-6">
              Please log in to create a listing.
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
            onLogin={() => setShowLoginModal(false)}
          />
        )}
      </>
    )
  }

  const handleMapClick = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    })
    setMapCenter([lat, lng])
  }

  const handleImageAdd = (url: string) => {
    if (formData.images.length >= 10) {
      alert('Maximum 10 images allowed')
      return
    }
    setFormData({
      ...formData,
      images: [...formData.images, url],
    })
  }

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          images: formData.images.length > 0 ? formData.images : null,
        }),
      })

      if (res.ok) {
        router.push('/home')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-4">
      <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Create Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="2-bedroom apartment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
            placeholder="Describe your property..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price *</label>
          <div className="flex gap-2">
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="1000"
            />
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="UZS">UZS</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Tashkent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Street address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Location (click on map)
          </label>
          <YandexMap
            center={mapCenter}
            markers={
              formData.latitude && formData.longitude
                ? [
                    {
                      lat: parseFloat(formData.latitude),
                      lng: parseFloat(formData.longitude),
                      title: formData.title || 'Selected location',
                    },
                  ]
                : []
            }
            onLocationChange={handleMapClick}
            height="300px"
          />
          {formData.latitude && formData.longitude && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {formData.latitude}, {formData.longitude}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Images (up to 10, enter URLs)
          </label>
          <div className="space-y-2">
            {formData.images.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const newImages = [...formData.images]
                    newImages[index] = e.target.value
                    setFormData({ ...formData, images: newImages })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Remove
                </button>
              </div>
            ))}
            {formData.images.length < 10 && (
              <button
                type="button"
                onClick={() => handleImageAdd('')}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                + Add Image URL
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}

