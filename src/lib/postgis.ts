import { prisma } from './prisma'

export interface NearbyListing {
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
  images: any
  views: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  distance_km: number
}

export async function findNearbyListings(
  lat: number,
  lng: number,
  radiusKm: number = 10
): Promise<NearbyListing[]> {
  // Using Prisma raw query for PostGIS
  // Note: This requires PostGIS extension to be enabled
  const results = await prisma.$queryRawUnsafe<NearbyListing[]>(`
    SELECT 
      id,
      "userId",
      title,
      description,
      price,
      currency,
      city,
      address,
      latitude,
      longitude,
      images,
      views,
      "isActive",
      "createdAt",
      "updatedAt",
      ST_Distance(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${lng}, ${lat})::geography
      ) / 1000 as distance_km
    FROM listings
    WHERE 
      latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND "isActive" = true
      AND ST_DWithin(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${lng}, ${lat})::geography,
        ${radiusKm * 1000}
      )
    ORDER BY distance_km
    LIMIT 50
  `)
  
  return results
}

