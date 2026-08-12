# Migration Guide - New Fields Added

## 🆕 New Features Added

1. **Area (m²)** - Property area in square meters
2. **Rooms** - Number of rooms
3. **Max People** - Maximum number of people that can fit
4. **Currency** - Price currency selector (UZS, USD, EUR)
5. **Marker Clustering** - Groups nearby markers when zoomed out

## 📊 Database Migration

You need to run a Prisma migration to add the new fields to your database.

### Step 1: Update Database Schema

```bash
cd ijarachi-uz/backend
npm run prisma:migrate
```

When prompted, enter migration name: `add_listing_fields`

### Step 2: Verify Migration

The migration will add these fields to the `Listing` table:
- `currency` (String, default: "UZS")
- `area` (Int, optional)
- `rooms` (Int, optional)
- `maxPeople` (Int, optional)

### Step 3: Restart Backend

```bash
npm run dev
```

## ✅ What's New

### Listing Form
- Currency selector (UZS/USD/EUR) next to price
- Area input (m²)
- Rooms input
- Max People input

### Listing Display
- Shows area, rooms, and max people on listing cards
- Shows currency with price
- Detailed view shows all fields

### Map Clustering
- Markers automatically group when zoomed out
- Shows count (e.g., "4 houses") on cluster
- Click cluster to zoom in and see individual markers
- Smooth zoom animation

## 🎯 Example Usage

When creating a listing:
1. Enter price: `500000`
2. Select currency: `UZS` (or USD/EUR)
3. Enter area: `50` (m²)
4. Enter rooms: `2`
5. Enter max people: `4`

The listing will display:
- **500,000 UZS**
- **50 m²**
- **Rooms: 2**
- **Max People: 4**

## 🔍 Map Clustering Behavior

- **Zoomed Out**: Shows clusters with count (e.g., "3", "12")
- **Zoomed In**: Shows individual markers
- **Click Cluster**: Automatically zooms in to show individual listings
- **Smooth**: All transitions are animated

## 📝 Notes

- All new fields are **optional** (except currency which defaults to UZS)
- Existing listings will have `currency: "UZS"` and null values for area/rooms/maxPeople
- Clustering works automatically - no configuration needed

