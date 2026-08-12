# Ijarachi - Rental Web App

A mobile-first rental web application built with Next.js, Prisma, PostgreSQL, and PostGIS.

## Features

- 🔐 Telegram WebApp authentication
- 🗺️ Yandex Maps integration with geolocation
- 💰 Multi-currency support (USD, EUR, UZS) with dynamic conversion
- 📍 PostGIS-powered "Near me" search
- ❤️ Save favorite listings
- 📋 Request system with likes and watch notifications
- 🔔 In-app notifications
- 🌍 Multi-language support (UZ, RU, EN)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Maps**: Yandex Maps API
- **Auth**: Telegram WebApp SDK

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with PostGIS extension
- Telegram Bot Token
- Yandex Maps API Key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ijarachi?schema=public"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token_here"
NEXT_PUBLIC_YANDEX_MAPS_API_KEY="your_yandex_maps_api_key_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up PostgreSQL with PostGIS

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ijarachi;

# Connect to the database
\c ijarachi

# Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 4. Run Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or create a migration
npm run db:migrate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ijarachipro.uz/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── listings/
│   │   │   ├── requests/
│   │   │   ├── favorites/
│   │   │   ├── notifications/
│   │   │   └── user/
│   │   ├── (tabs)/             # Tab screens
│   │   │   ├── home/
│   │   │   ├── search/
│   │   │   ├── saved/
│   │   │   ├── requests/
│   │   │   └── account/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── modals/
│   │   ├── maps/
│   │   └── ui/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── telegram.ts
│   │   ├── currency.ts
│   │   ├── postgis.ts
│   │   └── auth.ts
│   └── types/
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/telegram` - Verify Telegram WebApp initData and login

### Listings
- `GET /api/listings` - Get listings (supports ?city=, ?lat=&lng=)
- `GET /api/listings/latest` - Get latest listings
- `GET /api/listings/me` - Get user's listings (auth required)
- `POST /api/listings` - Create listing (auth required)

### Favorites
- `POST /api/favorites/:id` - Toggle favorite (auth required)

### Requests
- `GET /api/requests` - Get all requests (sorted by likes)
- `POST /api/requests` - Create request (auth required)
- `POST /api/requests/:id/like` - Toggle like (auth required)
- `POST /api/requests/:id/watch` - Toggle watch (auth required)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required)
- `PATCH /api/notifications` - Mark as read (auth required)

### User
- `GET /api/user/me` - Get current user (auth required)
- `POST /api/user/settings` - Update settings (auth required)

## Features Explained

### Authentication
Users can browse without login, but must authenticate via Telegram WebApp to:
- Like/save listings
- Create listings
- Create requests
- Like requests
- Enable notifications

### Geolocation
- "Near me" button uses browser geolocation
- PostGIS powers distance-based search
- Yandex Maps shows listings on map

### Currency Conversion
- Prices stored as entered
- Frontend converts to user's preferred currency
- Mock exchange rates (replace with real API)

### Request System
- Users can create rental requests
- Others can like requests (shows demand)
- Users can watch requests for notifications
- When matching listing appears, watchers get notified

## Development

### Database Studio
```bash
npm run db:studio
```

### Create Migration
```bash
npm run db:migrate
```

## Production Deployment

1. Set up PostgreSQL database with PostGIS
2. Set environment variables
3. Run migrations
4. Build the app: `npm run build`
5. Start the server: `npm start`

## Notes

- Telegram WebApp SDK is loaded automatically when opened in Telegram
- For development/testing, fallback auth is available
- PostGIS extension must be enabled in PostgreSQL
- Yandex Maps requires API key

## License

MIT

