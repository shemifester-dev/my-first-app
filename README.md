# Trading Dashboard Mobile App

A React Native mobile application for monitoring your trading bot portfolio in real-time.

![Platform](https://img.shields.io/badge/platform-iOS-lightgrey)
![Framework](https://img.shields.io/badge/framework-Expo-blue)
![Status](https://img.shields.io/badge/status-Active-green)

## Overview

This mobile app provides a clean, real-time interface to monitor your trading bot's performance and trading signals from your iPhone. It connects to your Python trading bot's Flask API over your local network. The app focuses on tracking signals and their performance rather than actual positions, since the bot monitors signals without executing trades.

### Features

- **Real-time Portfolio Monitoring**
  - Total P&L (profit/loss) tracking
  - Active signals count
  - Portfolio allocation percentage
  - Strategy version display

- **Signal Tracking**
  - View all signals grouped by symbol
  - Signal type (BUY, SELL, BREAKOUT, BREAKDOWN)
  - Entry price, current price, and today's profit/loss
  - Multiple signals per symbol support
  - Top 5 symbols by average profit

- **Signal Detail View**
  - Comprehensive signal information
  - Strategy version and signal type
  - Historical outcomes (1/3/7/14/30 day performance)
  - Technical indicators (resistance, support, breakout type, etc.)
  - Today's price and profit/loss tracking

- **Theme Support**
  - Dark and light theme options
  - Theme toggle in settings
  - Consistent theming across all screens

- **Auto-Refresh**
  - Data updates every 30 seconds (configurable)
  - Pull-to-refresh on all screens
  - Clean error handling

- **Push Notifications**
  - Expo push notification integration
  - Automatic token registration with backend
  - Ready to receive notifications from trading bot

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
├── App.js                      # Main app with navigation
├── screens/                    # Screen components
│   ├── HomeScreen.js          # Portfolio summary & top symbols
│   ├── SignalsScreen.js       # All signals grouped by stock
│   ├── SignalDetailScreen.js  # Individual signal details
│   ├── SettingsScreen.js      # App settings & theme toggle
│   └── PositionsScreen.js     # Legacy (kept for reference)
├── services/                   # Service modules
│   └── notificationService.js # Push notification service
├── contexts/                   # React contexts
│   └── ThemeContext.js        # Dark/light theme provider
├── config/                     # Configuration
│   └── app.config.js          # API URL, refresh interval, etc.
├── docs/                       # Comprehensive documentation
└── package.json                # Dependencies
```

## Documentation

Detailed documentation is available in the `/docs` folder:

- **[01-PROJECT-OVERVIEW.md](docs/01-PROJECT-OVERVIEW.md)** - Project architecture and features
- **[02-SETUP-GUIDE.md](docs/02-SETUP-GUIDE.md)** - Installation and configuration
- **[03-CODE-STRUCTURE.md](docs/03-CODE-STRUCTURE.md)** - Code organization and patterns
- **[04-API-INTEGRATION.md](docs/04-API-INTEGRATION.md)** - Trading bot API integration

## Configuration

### Update API URL

If your trading bot IP changes, update the API URL in `config/app.config.js`:

```javascript
export const config = {
  apiUrl: 'http://YOUR_IP_HERE:5000',
  refreshInterval: 30000,  // 30 seconds
  appVersion: '1.1.0',
  appName: 'Trading Dashboard',
};
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

### Home Tab

The home screen shows:
- Portfolio summary with total P&L and active signal count
- Strategy version
- Top 5 symbols ranked by average today's profit
- Real-time data updates

### Signals Tab

View all trading signals:
- Signals grouped by stock symbol
- Multiple signals per symbol supported
- Shows signal type, date, entry price, today's profit/loss
- Tap any signal to view full details

### Signal Details

Tap on any signal to see:
- Signal information (type, date, price, strategy version, status)
- Today's performance (current price, profit/loss %)
- Historical outcomes (1/3/7/14/30 day performance with prices)
- Technical indicators (resistance, support, breakout type, etc.)

### Settings Tab

- Toggle between dark and light themes
- View app version and info
- See API connection details

### Refreshing Data

- **Auto-refresh:** Every 30 seconds (configurable)
- **Manual refresh:** Pull down on any screen

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
- **React Navigation** - Bottom tab and stack navigation
- **React Context API** - Theme management
- **Fetch API** - HTTP requests
- **React Hooks** - State management
- **react-native-chart-kit** - Charts (for future enhancements)
- **react-native-svg** - SVG rendering support

## API Endpoints

The app connects to your trading bot's Flask API:

- `GET /api/portfolio_summary` - Portfolio overview (P&L, allocation)
- `GET /api/signals_by_stock` - All trading signals grouped by stock
- `GET /api/version` - Current strategy version
- `GET /api/positions` - Open positions (legacy, kept for reference)
- `POST /api/register-push-token` - Register device push notification tokens

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

### Completed Features

- ✅ Portfolio summary display
- ✅ Signal tracking (grouped by stock)
- ✅ Bottom tab navigation (3 screens)
- ✅ Individual signal detail screens
- ✅ Dark/light theme toggle
- ✅ Settings and preferences
- ✅ Stack navigation for detail views
- ✅ Theme context with consistent styling
- ✅ Centralized configuration
- ✅ Auto-refresh and pull-to-refresh
- ✅ Push notification service integration
- ✅ Token registration with backend

### Future Plans

- ⏳ Charts and performance graphs
- ⏳ Push notification handling and navigation
- ⏳ Custom alert configuration
- ⏳ Historical performance analysis
- ⏳ WebSocket for real-time updates
- ⏳ Trade execution from mobile (if bot supports)
- ⏳ Filter and sort signals
- ⏳ Search functionality

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

Private project - All rights reserved

## Acknowledgments

- Built with assistance from Claude (Anthropic)
- Trading strategy: "Dad's Bollinger Strategy" (version displayed from API)
- Powered by React Native and Expo

---

**Note:** This app is for monitoring purposes only. The bot watches signals and doesn't execute actual trades. Always verify data with your trading bot dashboard before making any trading decisions.

## Support

For issues or questions:
1. Check the [docs](docs/) folder
2. Review [Setup Guide](docs/02-SETUP-GUIDE.md)
3. Test API endpoints manually with curl

---

**Last Updated:** November 4, 2025
**Version:** 1.1.0
