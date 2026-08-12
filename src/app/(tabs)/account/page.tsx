'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginModal } from '@/components/modals/LoginModal'
import { ListingCard } from '@/components/ui/ListingCard'
import { Listing } from '@/types'
import Link from 'next/link'

export default function AccountPage() {
  const { user, initData, isAuthenticated, logout } = useAuth()
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [settings, setSettings] = useState({
    preferredLang: user?.preferredLang || 'uz',
    preferredCurrency: user?.preferredCurrency || 'UZS',
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyListings()
      fetchNotifications()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (user) {
      setSettings({
        preferredLang: user.preferredLang,
        preferredCurrency: user.preferredCurrency,
      })
    }
  }, [user])

  const fetchMyListings = async () => {
    try {
      const headers: HeadersInit = {}
      if (initData) {
        headers.Authorization = JSON.stringify({ initData })
      }
      const res = await fetch('/api/listings/me', { headers })
      if (res.ok) {
        const { listings } = await res.json()
        setMyListings(listings)
      }
    } catch (error) {
      console.error('Error fetching my listings:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const headers: HeadersInit = {}
      if (initData) {
        headers.Authorization = JSON.stringify({ initData })
      }
      const res = await fetch('/api/notifications', { headers })
      if (res.ok) {
        const { notifications: data, unreadCount: count } = await res.json()
        setNotifications(data)
        setUnreadCount(count)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setShowSettings(false)
        // Refresh user data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleMarkAsRead = async (id?: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
        body: JSON.stringify({ id, isRead: true }),
      })

      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.stringify({ initData }),
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <p className="text-gray-600 mb-6">
              Please log in to view your account.
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

  const userCurrency = user?.preferredCurrency || 'UZS'

  return (
    <div className="min-h-screen pb-4">
      <div className="bg-white sticky top-0 z-10 p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Account</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-gray-500">@{user?.username || 'username'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center gap-2"
            >
              <span className="text-xl">🔔</span>
              <span className="font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount > 9 ? '+9' : unreadCount}
                </span>
              )}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-teal-500"
              >
                Mark all read
              </button>
            )}
          </div>
          {showNotifications && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl ${
                      !notif.isRead ? 'bg-teal-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{notif.title}</h3>
                        {notif.body && (
                          <p className="text-sm text-gray-600">{notif.body}</p>
                        )}
                      </div>
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-xs text-teal-500 ml-2"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex justify-between items-center"
          >
            <span className="font-semibold">⚙️ Settings</span>
            <span>{showSettings ? '▲' : '▼'}</span>
          </button>
          {showSettings && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Language
                </label>
                <select
                  value={settings.preferredLang}
                  onChange={(e) =>
                    setSettings({ ...settings, preferredLang: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="uz">O'zbek</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={settings.preferredCurrency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferredCurrency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="UZS">UZS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <button
                onClick={handleSaveSettings}
                className="w-full bg-teal-500 text-white py-2 rounded-xl font-medium hover:bg-teal-600 transition-colors"
              >
                Save Settings
              </button>
            </div>
          )}
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">My Listings</h2>
          {myListings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No listings yet</p>
              <Link
                href="/create"
                className="text-teal-500 font-medium hover:underline"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  userCurrency={userCurrency}
                  onFavoriteToggle={fetchMyListings}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

