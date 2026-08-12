# Neon.tech Database Setup Guide

## 🚀 Quick Setup with Neon.tech

Neon.tech is a serverless PostgreSQL provider - perfect for this project!

## Step 1: Get Your Neon Connection String

1. **Sign in to Neon.tech** → https://neon.tech
2. **Create a new project** (or use existing)
3. **Get your connection string:**
   - Go to your project dashboard
   - Click on "Connection Details" or "Connection String"
   - Copy the connection string (it looks like this):
     ```
     postgres://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```

## Step 2: Create Backend `.env` File

1. Navigate to `ijarachi-uz/backend/`
2. Create a file named `.env`
3. Add this content:

```env
DATABASE_URL="your-neon-connection-string-here"
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
```

**Important:** 
- Paste your Neon connection string where it says `your-neon-connection-string-here`
- Keep the quotes around the connection string
- Make sure it includes `?sslmode=require` at the end (Neon requires SSL)

**Example:**
```env
DATABASE_URL="postgres://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
```

## Step 3: Update Prisma for Neon

Neon uses PostgreSQL, so your Prisma schema is already compatible! But you might need to add connection pooling for better performance.

### Option A: Direct Connection (Simple)
Use the connection string directly (works fine for development):
```env
DATABASE_URL="postgres://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Option B: Connection Pooling (Recommended for Production)
Neon provides two connection strings:
- **Direct connection** - for migrations
- **Pooled connection** - for application queries

For Prisma migrations, use the **direct connection**:
```env
DATABASE_URL="postgres://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

For your application, you can use the **pooled connection** (but Prisma works fine with direct too).

## Step 4: Run Prisma Migrations

```bash
cd ijarachi-uz/backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

This will:
1. Generate Prisma Client
2. Create the database tables in your Neon database

## Step 5: Verify Connection

Test that everything works:
```bash
npm run dev
```

You should see: `Server running on port 3001`

## 🎯 Complete Setup Example

### Backend `.env` file:
```env
# Neon.tech connection string
DATABASE_URL="postgres://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Server config
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
```

### Frontend `.env` file (optional):
```env
VITE_API_URL=http://localhost:3001
```

## 🔍 Finding Connection String in Neon Dashboard

1. **Log in** to Neon.tech
2. **Select your project**
3. **Go to "Connection Details"** or **"Settings" → "Connection String"**
4. **Copy the connection string**
5. **Make sure it includes `?sslmode=require`**

## ⚠️ Important Notes

- **SSL Required:** Neon requires SSL, so make sure `?sslmode=require` is in your connection string
- **Free Tier:** Neon free tier is perfect for development
- **Connection Limits:** Neon free tier has connection limits, but Prisma connection pooling handles this
- **No Migration Issues:** Prisma works perfectly with Neon - no special configuration needed

## 🐛 Troubleshooting

### "SSL connection required"
- Add `?sslmode=require` to the end of your connection string
- Or use the connection string from Neon dashboard (it includes this)

### "Connection timeout"
- Check your internet connection
- Verify the connection string is correct
- Make sure you're using the correct region endpoint

### "Database does not exist"
- In Neon dashboard, create a database first
- Or use the default `neondb` database

### Prisma migration fails
- Make sure `DATABASE_URL` is correct in `.env`
- Run `npm run prisma:generate` first
- Check that Prisma can connect: `npx prisma db pull`

## ✅ Quick Checklist

- [ ] Created Neon.tech account and project
- [ ] Copied connection string from Neon dashboard
- [ ] Created `backend/.env` file
- [ ] Added `DATABASE_URL` with Neon connection string
- [ ] Added `?sslmode=require` to connection string
- [ ] Ran `npm run prisma:generate`
- [ ] Ran `npm run prisma:migrate`
- [ ] Backend server starts without errors

## 🚀 Next Steps

After setup:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Create your first listing!

That's it! Neon.tech makes it super easy - no local PostgreSQL installation needed! 🎉

