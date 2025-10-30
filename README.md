# Trading Dashboard Mobile App

A React Native mobile application for monitoring your trading bot portfolio in real-time.

![Platform](https://img.shields.io/badge/platform-iOS-lightgrey)
![Framework](https://img.shields.io/badge/framework-Expo-blue)
![Status](https://img.shields.io/badge/status-Active-green)

## Overview

This mobile app provides a clean, real-time interface to monitor your trading bot's performance, open positions, and trading signals from your iPhone. It connects to your Python trading bot's Flask API over your local network.

### Features

- **Real-time Portfolio Monitoring**
  - Total P&L (profit/loss) tracking
  - Open positions count
  - Portfolio allocation percentage

- **Position Tracking**
  - View all open positions
  - Entry/current prices and quantities
  - Individual position P&L
  - Stop-loss levels and days held

- **Trading Signals**
  - Historical signal tracking
  - Signal type (BUY, SELL, BREAKOUT, BREAKDOWN)
  - Performance tracking for each signal

- **Auto-Refresh**
  - Data updates every 30 seconds
  - Pull-to-refresh on all screens
  - Clean error handling

## Quick Start

### Prerequisites

- Node.js v18.19.1 or higher
- npm (comes with Node.js)
- iPhone with Expo Go app installed
- Trading bot running on same network

### Installation

```bash
# Clone or navigate to project
cd ~/Dev/my-first-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Connect Your iPhone

1. Open **Expo Go** app on your iPhone
2. Scan the QR code from your terminal
3. App will load and connect to your trading bot

## Project Structure

```
my-first-app/
├── App.js                 # Main app entry point
├── screens/               # Screen components
│   ├── HomeScreen.js      # Portfolio summary (active)
│   ├── PositionsScreen.js # All positions
│   ├── SignalsScreen.js   # Trading signals
│   └── SettingsScreen.js  # App settings
├── docs/                  # Comprehensive documentation
└── package.json           # Dependencies
```

## Documentation

Detailed documentation is available in the `/docs` folder:

- **[01-PROJECT-OVERVIEW.md](docs/01-PROJECT-OVERVIEW.md)** - Project architecture and features
- **[02-SETUP-GUIDE.md](docs/02-SETUP-GUIDE.md)** - Installation and configuration
- **[03-CODE-STRUCTURE.md](docs/03-CODE-STRUCTURE.md)** - Code organization and patterns
- **[04-API-INTEGRATION.md](docs/04-API-INTEGRATION.md)** - Trading bot API integration

## Configuration

### Update API URL

If your trading bot IP changes, update the API URL in `screens/HomeScreen.js`:

```javascript
const API_URL = 'http://YOUR_IP_HERE:5000';
```

### Trading Bot Setup

Ensure your trading bot dashboard is accessible on the network:

```yaml
# docker-compose.yml
dashboard:
  ports:
    - "0.0.0.0:5000:5000"
```

Restart the dashboard:
```bash
cd ~/Dev/trading-bot
docker compose restart dashboard
```

## Usage

### Main Screen

The home screen shows:
- Portfolio summary with total P&L
- Top 3 open positions
- Real-time data updates

### Refreshing Data

- **Auto-refresh:** Every 30 seconds
- **Manual refresh:** Pull down on the screen

### Viewing Detailed Information

*(Navigation coming soon)*
- Tap on positions to see details
- View full signal history
- Adjust app settings

## Development

### Making Changes

1. Edit files in your code editor
2. Save the file
3. App automatically reloads on your iPhone

### Clearing Cache

If things behave unexpectedly:

```bash
npx expo start --clear
```

Or in terminal press `Shift+C` to clear Metro cache.

### Viewing Logs

Console output appears in the terminal where you ran `npx expo start`.

## Technology Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library (coming soon)
- **Fetch API** - HTTP requests
- **React Hooks** - State management

## API Endpoints

The app connects to your trading bot's Flask API:

- `GET /api/portfolio_summary` - Portfolio overview
- `GET /api/positions` - Open positions
- `GET /api/signals_by_stock` - Trading signals

See [API Integration docs](docs/04-API-INTEGRATION.md) for details.

## Troubleshooting

### Cannot Connect to Server

- Check Expo is running: `npx expo start`
- Verify iPhone is on same WiFi network
- Restart Expo with: `npx expo start --clear`

### Cannot Connect to Trading Bot

- Check bot is running: `docker ps | grep dashboard`
- Test API: `curl http://YOUR_IP:5000/api/portfolio_summary`
- Verify `docker-compose.yml` has `0.0.0.0:5000:5000`

### Module Resolution Errors

```bash
rm -rf node_modules/.cache .expo
npx expo start --clear
```

See [Setup Guide](docs/02-SETUP-GUIDE.md) for more troubleshooting tips.

## Roadmap

### Coming Soon

- ✅ Portfolio summary display
- ✅ Position tracking
- ✅ Signal history
- ⏳ Bottom tab navigation (4 screens)
- ⏳ Individual position detail screens
- ⏳ Charts and graphs
- ⏳ Push notifications for new signals
- ⏳ Settings and preferences

### Future Plans

- WebSocket for real-time updates
- Trade execution from mobile
- Custom alert configuration
- Historical performance analysis
- Dark/light theme toggle

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

Private project - All rights reserved

## Acknowledgments

- Built with assistance from Claude (Anthropic)
- Trading strategy: "Dad's Bollinger Strategy v3.24"
- Powered by React Native and Expo

---

**Note:** This app is for monitoring purposes only. Always verify data with your trading bot dashboard before making trading decisions.

## Support

For issues or questions:
1. Check the [docs](docs/) folder
2. Review [Setup Guide](docs/02-SETUP-GUIDE.md)
3. Test API endpoints manually with curl

---

**Last Updated:** October 30, 2025
**Version:** 1.0.0
