# Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Database Setup

**Option A: Neon.tech (Recommended - Serverless PostgreSQL)**
1. Sign up at https://neon.tech (free tier available)
2. Create a new project
3. Copy your connection string from the dashboard
4. It should look like: `postgres://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
5. See `NEON_SETUP.md` for detailed instructions

**Option B: Local PostgreSQL**
```bash
# Create PostgreSQL database
createdb ijarachi

# Or using psql:
psql -U postgres
CREATE DATABASE ijarachi;
```

### 2. Backend Setup
```bash
cd ijarachi-uz/backend
npm install

# Create .env file (see ENV_SETUP.md for details)
# For Neon.tech, add your connection string:
# DATABASE_URL="postgres://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 3. Frontend Setup
```bash
cd ijarachi-uz/frontend
npm install
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173`

## 📋 Checklist

- [ ] Database ready (Neon.tech project created OR local PostgreSQL running)
- [ ] Backend `.env` file created with DATABASE_URL
- [ ] Database migrations applied (`npm run prisma:migrate`)
- [ ] Backend server running on port 3001
- [ ] Frontend dev server running on port 5173
- [ ] Browser allows geolocation (required for map)

## 🐛 Troubleshooting

### Backend won't start
- **Neon.tech users:** Verify connection string includes `?sslmode=require`
- **Local PostgreSQL:** Check PostgreSQL is running: `pg_isready` (Mac/Linux) or Services (Windows)
- Verify DATABASE_URL in `.env` is correct
- Run `npm run prisma:generate` if Prisma client is missing

### Frontend can't connect to backend
- Check backend is running on port 3001
- Verify VITE_API_URL in frontend `.env` (or use proxy in vite.config.ts)

### Map not showing
- Check browser console for Leaflet errors
- Verify geolocation permissions are granted
- Check internet connection (needed for OpenStreetMap tiles)

### Images not uploading
- Check `backend/uploads/` directory exists
- Verify UPLOAD_DIR in backend `.env`
- Check file size (max 10MB per image)

## 📱 Testing on Mobile

1. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update frontend `.env`: `VITE_API_URL=http://YOUR_IP:3001`
3. Access from mobile: `http://YOUR_IP:5173`
4. Ensure mobile and computer are on same network

## 🎯 Next Steps

- Add your first listing via the "+" button
- Test filters and search
- Try different languages (top-right)
- Test on mobile device

