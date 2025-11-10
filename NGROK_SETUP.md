# ngrok Setup for Local Backend Testing

## What is ngrok?

ngrok creates a secure tunnel from a public URL to your local backend server, allowing your iPhone to connect to your development backend.

## Quick Start

### Option 1: Use the Script (Easiest)

```bash
cd sprout-backend
./start-with-ngrok.sh
```

This will:
1. Start backend on port 3000
2. Start ngrok tunnel
3. Show you the public URL

### Option 2: Manual Setup

**Terminal 1 - Start Backend:**
```bash
cd sprout-backend
npm run dev
```

**Terminal 2 - Start ngrok:**
```bash
ngrok http 3000
```

## Get Your Public URL

**Option A: Web Interface**
Open http://localhost:4040 in your browser

**Option B: Command Line**
```bash
curl http://localhost:4040/api/tunnels | grep -o 'https://[^"]*ngrok[^"]*'
```

You'll get a URL like: `https://abc123.ngrok-free.app`

## Update Flutter App

**File:** `sprouts_flutter/lib/core/constants/app_constants.dart`

```dart
class AppConstants {
  // Replace with your ngrok URL
  static const String baseUrl = 'https://abc123.ngrok-free.app';

  // For production (later):
  // static const String baseUrl = 'https://your-backend.vercel.app';
}
```

## Testing the Connection

**1. Test from your computer:**
```bash
curl https://YOUR_NGROK_URL.ngrok-free.app/health
```

**2. Test from iPhone:**
- Open Safari on iPhone
- Go to: `https://YOUR_NGROK_URL.ngrok-free.app/health`
- Should see: `{"status":"OK","message":"Sprouts backend is running!"}`

**3. Run Flutter app:**
```bash
cd sprouts_flutter
flutter run --release -d iPhone
```

## Important Notes

### Free ngrok Limitations
- ⚠️ URL changes every time you restart ngrok
- ⚠️ Limited to 40 connections/minute
- ⚠️ Session expires after 8 hours

**Solution:** Update Flutter app baseUrl each time ngrok URL changes

### Paid ngrok Benefits
- ✅ Reserved domain (same URL every time)
- ✅ No connection limits
- ✅ $8/month

**Sign up:** https://dashboard.ngrok.com/

## Alternatives to ngrok

### Option 1: LocalTunnel (Free, but less stable)
```bash
npm install -g localtunnel
lt --port 3000
```

### Option 2: Your Computer's Local IP (Same WiFi only)
```bash
# Get your IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Example: 192.168.1.100
# Use: http://192.168.1.100:3000
```

**Pros:** Free, no limits
**Cons:** iPhone and computer must be on same WiFi

### Option 3: Deploy Backend (Recommended for testing)
Use Vercel/Railway for a permanent URL:
```bash
cd sprout-backend
vercel --prod
```

## Troubleshooting

**ngrok: command not found**
```bash
# Install ngrok
brew install ngrok

# Or download from:
# https://ngrok.com/download
```

**Connection refused**
- Make sure backend is running first
- Check port 3000 is not in use: `lsof -i :3000`

**CORS errors in Flutter app**
Backend already has CORS enabled in `src/index.ts`

**SSL certificate errors**
ngrok uses HTTPS by default, which is required for iOS

## ngrok Dashboard

Access at: http://localhost:4040

**Features:**
- See all HTTP requests in real-time
- Inspect request/response data
- Replay requests
- Monitor traffic

## Environment Variables

ngrok uses your backend's existing `_env` file. No additional config needed.

## Security

**ngrok URLs are public!** Anyone with the URL can access your backend.

**For production:**
- Don't use ngrok
- Deploy to Vercel/Railway with proper auth
- Use environment-specific configs

## Commands Reference

```bash
# Start ngrok on port 3000
ngrok http 3000

# With custom subdomain (paid only)
ngrok http 3000 --subdomain=sprouts-backend

# With auth token (required first time)
ngrok config add-authtoken YOUR_TOKEN

# View status
curl http://localhost:4040/api/tunnels

# Stop ngrok
# Press Ctrl+C in terminal
```

## Next Steps

1. ✅ Start backend with ngrok
2. ✅ Copy ngrok URL
3. ✅ Update Flutter app_constants.dart
4. ✅ Run Flutter app on iPhone
5. ✅ Test login and API calls

## Support

- ngrok Docs: https://ngrok.com/docs
- Status Page: https://status.ngrok.com/
