# Environment Variables Setup Guide

## 📝 Yes, you need to edit `.env` files!

You need to create `.env` files for both backend and frontend. Here's how:

## 🔧 Backend `.env` Setup

### Step 1: Create the file
Navigate to `ijarachi-uz/backend/` and create a file named `.env` (note the dot at the beginning).

### Step 2: Add these variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ijarachi?schema=public"
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
```

### Step 3: Replace with YOUR values

**DATABASE_URL** - Replace these parts:
- `username` → Your PostgreSQL username (usually `postgres`)
- `password` → Your PostgreSQL password
- `localhost:5432` → Your database host and port (usually `localhost:5432`)
- `ijarachi` → Your database name (can be any name you want)

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/ijarachi?schema=public"
```

**Other variables:**
- `PORT` → Backend server port (default: 3001)
- `NODE_ENV` → Keep as `development` for now
- `UPLOAD_DIR` → Directory for uploaded images (default: `./uploads`)

---

## 🎨 Frontend `.env` Setup (Optional)

### Step 1: Create the file
Navigate to `ijarachi-uz/frontend/` and create a file named `.env`.

### Step 2: Add this variable (only if needed)
```env
VITE_API_URL=http://localhost:3001
```

**Note:** If you don't create this file, the frontend will use the proxy in `vite.config.ts` which should work automatically.

**When you NEED this:**
- Testing on mobile device (use your computer's IP address)
- Production deployment
- Custom backend URL

**Example for mobile testing:**
```env
VITE_API_URL=http://192.168.1.100:3001
```
(Replace `192.168.1.100` with your computer's local IP address)

---

## 🚀 Quick Setup Commands

### Backend (Windows PowerShell)
```powershell
cd ijarachi-uz\backend
New-Item -Path .env -ItemType File
notepad .env
```
Then paste the content above and edit.

### Backend (Windows CMD)
```cmd
cd ijarachi-uz\backend
type nul > .env
notepad .env
```

### Backend (Mac/Linux)
```bash
cd ijarachi-uz/backend
cp .env.example .env  # If .env.example exists
# OR
touch .env
nano .env  # or use your preferred editor
```

### Frontend (Optional)
```powershell
cd ijarachi-uz\frontend
New-Item -Path .env -ItemType File
notepad .env
```
Add: `VITE_API_URL=http://localhost:3001`

---

## 🔍 Finding Your PostgreSQL Connection String

### If you have PostgreSQL installed locally:

**Windows:**
- Username: Usually `postgres`
- Password: The one you set during PostgreSQL installation
- Port: Usually `5432`
- Host: `localhost`

**Example:**
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ijarachi?schema=public"
```

### If using a cloud database:
Replace `localhost:5432` with your cloud provider's connection string.

---

## ✅ Verification Checklist

After creating `.env` files:

- [ ] Backend `.env` exists in `ijarachi-uz/backend/.env`
- [ ] DATABASE_URL is correct (test with `psql` command)
- [ ] PORT is set (default 3001)
- [ ] Frontend `.env` exists (optional, only if needed)
- [ ] No spaces around `=` in `.env` file
- [ ] Strings are in quotes (for DATABASE_URL)

---

## 🐛 Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready` (Mac/Linux) or check Services (Windows)
- Verify username/password in DATABASE_URL
- Ensure database exists: `createdb ijarachi` or create via pgAdmin

### "Port 3001 already in use"
- Change PORT in `.env` to another number (e.g., 3002)
- Update frontend VITE_API_URL if you changed it

### ".env file not working"
- Make sure file is named exactly `.env` (with the dot)
- No spaces around `=` signs
- Restart the server after editing `.env`

---

## 📝 Example Complete `.env` Files

### Backend `.env`
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@localhost:5432/ijarachi?schema=public"
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
```

### Frontend `.env` (optional)
```env
VITE_API_URL=http://localhost:3001
```

That's it! 🎉

