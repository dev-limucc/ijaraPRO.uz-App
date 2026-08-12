export interface Listing {
  id: string
  userId: string
  title: string
  description: string | null
  price: number
  currency: string
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  images: string[] | null
  views: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    name: string | null
    username: string | null
  }
  isFavorite?: boolean
}

export interface Request {
  id: string
  userId: string
  budget: number
  currency: string
  city: string | null
  location: string | null
  propertyType: string | null
  note: string | null
  createdAt: Date
  _count?: {
    likes: number
    watchers: number
  }
  user?: {
    name: string | null
    username: string | null
  }
  isLiked?: boolean
  isWatched?: boolean
}

export interface User {
  id: string
  telegramId: string
  name: string | null
  username: string | null
  phone: string | null
  preferredCurrency: string
  preferredLang: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string | null
  isRead: boolean
  createdAt: Date
}

