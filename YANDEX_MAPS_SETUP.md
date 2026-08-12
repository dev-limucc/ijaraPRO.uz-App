# Yandex Maps Setup Guide

## 🗺️ Getting Your Yandex Maps API Key

### Step 1: Get API Key (Free)

1. Go to **Yandex Cloud Console**: https://console.cloud.yandex.ru/
2. Sign up or log in (free account available)
3. Navigate to **API Keys** section
4. Create a new API key for **Yandex Maps JavaScript API**
5. Copy your API key

**OR** use without API key (limited requests per day):
- Remove `&apikey=YOUR_API_KEY` from the script tag
- Works for development but may have rate limits

### Step 2: Update index.html

Open `ijarachi-uz/frontend/index.html` and replace `YOUR_API_KEY`:

```html
<script src="https://api-maps.yandex.ru/2.1/?apikey=YOUR_ACTUAL_API_KEY&lang=uz_UZ" type="text/javascript"></script>
```

**Or without API key (for testing):**
```html
<script src="https://api-maps.yandex.ru/2.1/?lang=uz_UZ" type="text/javascript"></script>
```

### Step 3: Set Language

The `lang` parameter controls map labels:
- `uz_UZ` - Uzbek (default)
- `ru_RU` - Russian
- `en_US` - English

## ✅ What's Changed

- ✅ Replaced OpenStreetMap with Yandex Maps (modern, better for Uzbekistan)
- ✅ Fixed location picker - no longer snaps back to current location
- ✅ Added toggle: "Use Current Location" vs "Pick from Map"
- ✅ Repositioned zoom controls (bottom-right, adjusted to avoid conflict)
- ✅ Modern map styling with light theme
- ✅ Draggable marker for precise location selection

## 🎯 Features

### Location Selection Modes:

1. **Current Location** - Uses your GPS location automatically
2. **Pick from Map** - Drag the marker or click on the map to select location

### Map Improvements:

- Modern Yandex Maps interface
- Better coverage for Uzbekistan/Tashkent
- Customizable zoom controls position
- Smooth marker dragging
- Click-to-select location

## 🐛 Troubleshooting

### Map not showing
- Check browser console for errors
- Verify API key is correct (or remove it for free tier)
- Check internet connection

### "YOUR_API_KEY" error
- Replace `YOUR_API_KEY` with your actual key in `index.html`
- Or remove `&apikey=YOUR_API_KEY` to use free tier

### Location picker still snapping
- Make sure you're in "Pick from Map" mode (not "Current Location")
- The toggle button should be set to "Pick from Map"

## 💰 Yandex Maps API Pricing

### Free Tier (Open Access)

**Yes, Yandex Maps API is FREE** if your project meets these conditions:

1. ✅ **Public Access**: Your website/app must be accessible to all users without restrictions
2. ✅ **No Paywall**: If registration is required, it must be free and open to everyone
3. ✅ **Usage Limit**: Up to **2.5 million requests per year** (JavaScript API + Geocoder)

### For Your Project

Your rental platform qualifies for **FREE tier** because:
- ✅ No authentication required (users just provide name + phone)
- ✅ Public access to all listings
- ✅ Free to use

### Free Tier Limits

- **2.5 million requests/year** = ~6,849 requests/day
- Includes: Map rendering, geocoding, marker placement
- Perfect for development and small-to-medium apps

### When You Need Paid License

You only need to pay if:
- Exceeding 2.5 million requests/year
- App is behind a paywall or requires paid subscription
- Commercial closed-source applications

### Getting API Key (Free)

1. Go to: https://console.cloud.yandex.ru/
2. Sign up (free account)
3. Navigate to API Keys
4. Create key for "Yandex Maps JavaScript API"
5. Use the key in `index.html`

**Note**: You can also use without API key, but it's recommended to get one for better reliability and to track usage.

### References

- [Yandex Maps API Pricing](https://yandex.com/maps-api/tariffs)
- [Free Tier Conditions](https://yandex.com/dev/commercial/doc/en/)

