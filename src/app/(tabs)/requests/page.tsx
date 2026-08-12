'use client'
import { useEffect, useState } from 'react'
import { RequestCard } from '@/components/ui/RequestCard'
import { useAuth } from '@/contexts/AuthContext'
import { Request } from '@/types'
import { LoginModal } from '@/components/modals/LoginModal'

export default function RequestsPage() {
  const { user, initData, isAuthenticated } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [formData, setFormData] = useState({
    budget: '',
    currency: 'USD',
    city: '',
    propertyType: '',
    note: '',
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const headers: HeadersInit = {}
      if (initData) {
        headers.Authorization = JSON.stringify({ initData })
      }
      const res = await fetch('/api/requests', { headers })
      if (res.ok) {
        const { requests: data } = await res.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          budget: '',
          currency: 'USD',
          city: '',
          propertyType: '',
          note: '',
        })
        setShowForm(false)
        fetchRequests()
      }
    } catch (error) {
      console.error('Error creating request:', error)
    }
  }

  const userCurrency = user?.preferredCurrency || 'UZS'

  return (
    <div className="min-h-screen pb-4">
      <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Requests</h1>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setShowLoginModal(true)
              } else {
                setShowForm(!showForm)
              }
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-600 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Request'}
          </button>
        </div>
      </div>

      <div className="p-4">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Budget</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Property Type
              </label>
              <input
                type="text"
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Apartment, House, etc."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Note</label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder="Additional details..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
            >
              Create Request
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No requests found
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                userCurrency={userCurrency}
                onLikeToggle={fetchRequests}
                onWatchToggle={fetchRequests}
              />
            ))}
          </div>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => {
            setShowLoginModal(false)
            setShowForm(true)
          }}
        />
      )}
    </div>
  )
}

