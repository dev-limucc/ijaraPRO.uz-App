import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const router = express.Router();
const prisma = new PrismaClient();

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/listings/nearby?lat=...&lng=...&radius=...&category=...&tags=...&minPrice=...&maxPrice=...
router.get('/nearby', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 10; // default 10km
    const category = req.query.category as string | undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Get all listings (we'll filter by distance in code)
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter by distance and calculate distance for each listing
    const listingsWithDistance = listings
      .map(listing => {
        const listingLat = parseFloat(listing.lat.toString());
        const listingLng = parseFloat(listing.lng.toString());
        const distance = calculateDistance(lat, lng, listingLat, listingLng);
        return {
          ...listing,
          distance: Math.round(distance * 10) / 10, // round to 1 decimal
          lat: listingLat,
          lng: listingLng
        };
      })
      .filter(listing => listing.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json(listingsWithDistance);
  } catch (error) {
    console.error('Error fetching nearby listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        images: true
      }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({
      ...listing,
      lat: parseFloat(listing.lat.toString()),
      lng: parseFloat(listing.lng.toString())
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// POST /api/listings
router.post('/', async (req, res) => {
  try {
    const {
      title,
      price,
      currency,
      area,
      rooms,
      maxPeople,
      category,
      tags,
      description,
      address,
      name,
      phoneNumber,
      lat,
      lng,
      imageUrls
    } = req.body;

    // Validation
    if (!title || !price || !category || !name || !phoneNumber || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        price: parseInt(price),
        currency: currency || 'UZS',
        area: area ? parseInt(area) : null,
        rooms: rooms ? parseInt(rooms) : null,
        maxPeople: maxPeople ? parseInt(maxPeople) : null,
        category,
        tags: tags || [],
        description: description || null,
        address: address || null,
        name,
        phoneNumber,
        lat: new Decimal(lat),
        lng: new Decimal(lng),
        images: {
          create: (imageUrls || []).map((url: string) => ({
            url
          }))
        }
      },
      include: {
        images: true
      }
    });

    res.status(201).json({
      ...listing,
      lat: parseFloat(listing.lat.toString()),
      lng: parseFloat(listing.lng.toString())
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

export default router;

