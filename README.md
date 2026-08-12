# Ijarachi.uz - Telegram-based Rental Platform

A mobile-first React.js web application for a rental platform with Telegram bot integration.

## 🏗️ Project Structure

```
ijarachi-uz/
├── backend/          # Node.js + Express + Prisma + PostgreSQL
├── frontend/         # React + Vite + styled-components + Leaflet
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd ijarachi-uz/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/ijarachi?schema=public"
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
```

5. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ijarachi-uz/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to proxy):
```bash
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📱 Features

- **Map View**: Full-screen Leaflet map with OpenStreetMap tiles
- **Geolocation**: Automatic location detection on load
- **Bottom Sheet**: Swipeable listing cards with filters
- **Filters**: Price, category, tags, and distance filtering
- **Listing Detail**: Image carousel, contact info, description
- **Create Listing**: Simple form with location picker and image upload
- **Multi-language**: Uzbek (UZ), Russian (RU), English (EN)
- **Mobile-first**: Optimized for 375-430px width screens

## 🎨 Design

- Primary: #3B82F6 (sky blue)
- Accent: #10B981 (teal green)
- Background: #F9FAFB (soft white)
- Text: #111827 (deep gray)
- Secondary: #6366F1 (modern violet)

## 🔌 API Endpoints

### Backend

- `GET /api/listings/nearby?lat=...&lng=...` - Get nearby listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `POST /api/upload` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

## 📦 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Multer (file uploads)

### Frontend
- React 18
- TypeScript
- Vite
- styled-components
- React Router
- Leaflet + React-Leaflet
- Axios

## 🗄️ Database Schema

```prisma
model Listing {
  id          String        @id @default(cuid())
  title       String
  price       Int
  category    String
  tags        String[]
  description String?
  name        String
  phoneNumber String
  lat         Decimal       @db.Decimal(9, 6)
  lng         Decimal       @db.Decimal(9, 6)
  images      ListingImage[]
  createdAt   DateTime      @default(now())
}

model ListingImage {
  id        String   @id @default(cuid())
  url       String
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id])
}
```

## 🌍 Languages

The app supports three languages:
- **Uzbek (UZ)** - Default
- **Russian (RU)**
- **English (EN)**

Language switcher is located in the top-right corner.

## 📝 Notes

- No authentication required - users provide name and phone when creating listings
- Images are stored in `backend/uploads/` directory
- Map uses OpenStreetMap tiles (free, no API key required)
- Mobile gestures supported: pinch zoom, pan, tap-to-focus
- Scroll wheel zoom disabled on mobile

## 🛠️ Development

### Backend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Production server
npm run prisma:studio # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📄 License

ISC

