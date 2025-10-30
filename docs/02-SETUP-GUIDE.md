# Setup Guide

## Prerequisites

Before starting, you need:

1. **Node.js** installed (v18.19.1 or higher recommended)
2. **npm** (comes with Node.js)
3. **iPhone** with Expo Go app installed (from App Store)
4. **Ubuntu machine** (where the trading bot runs)
5. **Same WiFi network** for both iPhone and Ubuntu machine

## Initial Setup

### 1. Install Dependencies

```bash
cd ~/Dev/my-first-app
npm install
```

This installs all required packages:
- `expo` - The Expo framework
- `react` & `react-native` - React Native core
- `react-native-safe-area-context` - Handle iPhone notch
- `@react-navigation/*` - Navigation libraries (for future use)
- `expo-status-bar` - Status bar component

### 2. Start the Development Server

```bash
npx expo start
```

Or to clear cache:
```bash
npx expo start --clear
```

You'll see:
```
Metro waiting on exp://192.168.1.253:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 3. Connect Your iPhone

**On your iPhone:**
1. Open **Expo Go** app
2. Tap **"Scan QR Code"** or use iPhone Camera app
3. Scan the QR code from your terminal
4. Wait for the app to load

The app will reload automatically when you save changes to the code.

## Trading Bot Setup

The mobile app needs the trading bot API to be accessible on the network.

### 1. Update Docker Configuration

Edit `~/Dev/trading-bot/docker-compose.yml`:

```yaml
dashboard:
  ports:
    - "0.0.0.0:5000:5000"  # Allow network access
```

### 2. Restart Trading Bot Dashboard

```bash
cd ~/Dev/trading-bot
docker compose up -d dashboard
```

### 3. Verify API Access

Test from your Ubuntu machine:
```bash
curl http://192.168.1.253:5000/api/portfolio_summary
```

You should see JSON data with portfolio information.

## Network Configuration

### Finding Your Local IP

```bash
hostname -I | awk '{print $1}'
```

This shows your Ubuntu machine's local IP (e.g., `192.168.1.253`).

### Updating API URL in App

If your IP changes, edit `screens/HomeScreen.js`:

```javascript
const API_URL = 'http://YOUR_IP_HERE:5000';
```

Replace `YOUR_IP_HERE` with your actual IP address.

## Common Issues

### "Could not connect to the server"

**Problem:** Expo server not running or wrong port.

**Solution:**
1. Make sure `npx expo start` is running in terminal
2. Check if iPhone is on same WiFi network
3. Try restarting Expo: Ctrl+C, then `npx expo start --clear`

### "Failed to connect to trading bot"

**Problem:** Trading bot API not accessible from network.

**Solution:**
1. Check docker-compose.yml has `0.0.0.0:5000:5000`
2. Restart dashboard: `docker compose restart dashboard`
3. Test API: `curl http://YOUR_IP:5000/api/portfolio_summary`
4. Check firewall settings

### "Unable to resolve module"

**Problem:** Metro bundler cache issue.

**Solution:**
1. Stop expo (Ctrl+C)
2. Clear cache: `rm -rf node_modules/.cache .expo`
3. Restart: `npx expo start --clear`

### Title masked by iPhone notch

**Problem:** Safe area not configured properly.

**Solution:** Already fixed in `HomeScreen.js` using `useSafeAreaInsets()`.

## Development Workflow

### Making Changes

1. Edit files in your code editor
2. Save the file
3. App automatically reloads on iPhone
4. If it doesn't reload: shake iPhone → tap "Reload"

### Viewing Logs

**In terminal:** All console.log() output appears here

**On iPhone:** Shake iPhone → tap "Debug Remote JS" (if needed)

### Clearing Cache

When things act weird:
1. In terminal press `Shift+C` (clears Metro cache)
2. Or restart with: `npx expo start --clear`

## Next Steps

Once setup is complete:
1. Verify app loads on iPhone
2. Verify trading data appears
3. Test pull-to-refresh
4. Check auto-refresh works (wait 30 seconds)
5. Ready to add more features!
