# Ijarachi Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5434/ijarachi?schema=public"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
NEXT_PUBLIC_YANDEX_MAPS_API_KEY="your_yandex_maps_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

#### Option A: Using psql
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ijarachi;

# Connect to database
\c ijarachi

# Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Exit
\q
```

#### Option B: Using Docker
```bash
docker run --name ijarachi-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=ijarachi \
  -p 5432:5432 \
  -d postgis/postgis:14-3.2

# Then connect and enable PostGIS
docker exec -it ijarachi-db psql -U postgres -d ijarachi -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### 4. Run Migrations
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

## Getting API Keys

### Telegram Bot Token
1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Follow instructions to create a bot
4. Copy the bot token to `.env`

### Yandex Maps API Key
1. Go to https://developer.tech.yandex.com/
2. Create a new project
3. Get your API key
4. Add it to `.env` as `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`

## Testing

### Test Telegram Auth (Development)
The app includes a fallback for development. You can test without Telegram by:
1. Opening the app in a browser (not Telegram)
2. Clicking "Login with Telegram"
3. The fallback will create a test user

### Test in Telegram
1. Create a Telegram bot via @BotFather
2. Set up a WebApp using @BotFather's menu
3. Open the WebApp URL in Telegram

## Common Issues

### PostGIS not found
- Make sure PostGIS extension is installed: `CREATE EXTENSION postgis;`
- Verify with: `SELECT PostGIS_version();`

### Database connection error
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify database exists

### Telegram auth not working
- Verify TELEGRAM_BOT_TOKEN is set
- Check that bot token is correct
- Ensure app is opened in Telegram WebApp

## Production Deployment

1. Set up PostgreSQL with PostGIS on your server
2. Set all environment variables
3. Run `npm run build`
4. Start with `npm start`

