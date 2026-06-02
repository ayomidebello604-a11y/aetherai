# Network Deployment Guide - Adverse AI

This guide explains how to run Adverse AI on your local network so other devices can access it.

## Quick Start

### For Windows (Recommended)

```bash
npm run build
npm run start:network
```

Or double-click: `scripts/build-network.bat`

### For macOS/Linux

```bash
npm run build
npm run start:network
```

Or run: `bash scripts/build-network.sh`

## How It Works

### 1. Authentication (Supabase - Cloud-Based)

- **Supabase** handles all authentication via the cloud
- Works from any network because it's cloud-based
- No local setup needed - it's already configured in `.env.local`

### 2. Network Access

- The app runs on `0.0.0.0:3000` (all network interfaces)
- Access it from any device on your network:
  - **Local**: `http://localhost:3000`
  - **Network**: `http://<YOUR-IP>:3000`
  - **Example**: `http://192.168.1.100:3000`

### 3. API Keys

- **Supabase**: Cloud-based (works everywhere)
- **Gemini API**: Cloud-based (works everywhere)
- **GROQ API**: Cloud-based (works everywhere)

All APIs are cloud-based, so they work from any network location automatically.

## Finding Your Network IP

### Windows (PowerShell)

```powershell
ipconfig
```

Look for "IPv4 Address" under your active connection (usually starts with 192.168.x.x)

### macOS/Linux (Terminal)

```bash
ifconfig
```

Look for `inet` address under your active connection

### Quick Troubleshooting

If you can't find your IP:

- Windows: Open Command Prompt → `ipconfig`
- Mac: System Preferences → Network → Check IP
- Linux: Terminal → `hostname -I`

## Usage from Other Devices

### Same Wi-Fi Network

1. Find your computer's IP (see above)
2. On another device, open browser
3. Go to: `http://<YOUR-IP>:3000`

### Example Flow

```
Device A (192.168.1.100): Running Adverse AI
Device B (192.168.1.50):  Opens browser → http://192.168.1.100:3000
                          ✅ Can login with Supabase authentication
                          ✅ Can chat with AI
                          ✅ Everything works!
```

## Firewall Settings

If you can't access from another device:

### Windows Firewall

1. Settings → Privacy & Security → Windows Defender Firewall
2. Allow an app through firewall
3. Add `node.exe` or the port 3000

### macOS

1. System Preferences → Security & Privacy → Firewall
2. Firewall Options → Allow incoming connections

### Linux

```bash
sudo ufw allow 3000
```

## Production Deployment

For permanent internet access (outside your local network):

### Option 1: Railway/Render (Recommended)

```bash
# Install Railway CLI
npm install -g railway

# Deploy
railway up
```

### Option 2: Docker

```bash
# Build Docker image
docker build -t adverse-ai .

# Run
docker run -p 3000:3000 adverse-ai
```

### Option 3: Traditional Server

```bash
# Build
npm run build

# Start
npm start -- -H 0.0.0.0 -p 3000
```

## Environment Variables

Your `.env.local` already has everything configured:

- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ GROQ_API_KEY
- ✅ GEMINI_API_KEY

**No additional setup needed** - just run the app!

## Testing

### Verify Network Access

1. Start the app: `npm run start:network`
2. On another device, try to access it
3. You should see the login page

### Verify Authentication

1. Login with your Supabase credentials
2. Go to Researcher section
3. Send a message
4. You should get a response from AI

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Can't Connect from Network

1. Check firewall is allowing port 3000
2. Check both devices are on same Wi-Fi
3. Verify IP address is correct
4. Try restarting the app

### Authentication Not Working

- Supabase should work automatically
- Check internet connection
- Verify `.env.local` has correct Supabase keys
- Check browser console for errors

### API Not Responding

- Check internet connection (APIs are cloud-based)
- Verify API keys in `.env.local`
- Check browser developer tools (F12) for errors

## Commands Reference

```bash
# Local development
npm run dev

# Production build (local only)
npm run build
npm start

# Production build + network access
npm run network

# Or step by step
npm run build
npm run start:network
```

## Support

If you encounter issues:

1. Check the `TESTING_TROUBLESHOOTING.md` file
2. Verify all environment variables are set
3. Check firewall settings
4. Ensure all devices are on the same network
5. Try restarting the app
