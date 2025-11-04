# Project Overview

## Trading Dashboard Mobile App

This is a React Native mobile application built with Expo that displays real-time trading data from a Python-based trading bot.

### Project Purpose

The app provides a mobile interface to monitor trading signals and portfolio performance from your trading bot anywhere on your iPhone. The app focuses on tracking signals being watched by the bot rather than actual positions, since the bot monitors signals without executing trades.

### Technology Stack

- **Framework:** React Native (via Expo)
- **Language:** JavaScript (React)
- **UI:** React Native components with custom styling
- **Navigation:** React Navigation (Bottom Tabs + Stack Navigator)
- **State Management:** React Hooks (useState, useEffect) + Context API
- **API Communication:** Fetch API
- **Safe Area Handling:** react-native-safe-area-context
- **Theme Management:** React Context API (ThemeContext)
- **Charts:** react-native-chart-kit (ready for future use)
- **SVG Support:** react-native-svg

### Key Features

1. **Portfolio Summary**
   - Total P&L (profit/loss percentage and dollars)
   - Number of active signals being tracked
   - Portfolio allocation percentage
   - Strategy version display (fetched from API)

2. **Signal Tracking**
   - View all signals grouped by stock symbol
   - Multiple signals per symbol support
   - Signal type (BUY, SELL, BREAKOUT, BREAKDOWN)
   - Entry price, current price, today's profit/loss
   - Top 5 symbols ranked by average profit

3. **Signal Detail View**
   - Comprehensive signal information
   - Strategy version and signal type
   - Historical outcomes (1/3/7/14/30 day performance)
   - Technical indicators (resistance, support, breakout type, etc.)
   - Today's price and profit/loss tracking
   - Tappable signals for detail navigation

4. **Theme Support**
   - Dark and light theme options
   - Theme toggle in settings
   - Consistent theming across all screens
   - Dynamic colors for text, cards, borders, profit/loss

5. **Navigation**
   - Bottom tab navigation (Home, Signals, Settings)
   - Stack navigation for detail screens
   - Proper iPhone notch handling
   - Back navigation with header

6. **Real-time Updates**
   - Auto-refresh every 30 seconds (configurable)
   - Pull-to-refresh on all screens
   - Live connection to trading bot API
   - Error handling and loading states

7. **Push Notifications**
   - Expo push notification integration
   - Token registration with backend
   - Notification listeners for received and tapped events
   - Graceful error handling for service unavailability
   - Ready for backend to send notifications

### Architecture

```
my-first-app/
├── App.js                      # Main app with navigation setup
├── screens/                    # Screen components
│   ├── HomeScreen.js          # Portfolio summary & top 5 symbols
│   ├── SignalsScreen.js       # All signals grouped by stock
│   ├── SignalDetailScreen.js  # Individual signal details
│   ├── SettingsScreen.js      # App settings & theme toggle
│   ├── PositionDetailScreen.js # Legacy detail screen
│   └── PositionsScreen.js     # Legacy positions (kept for reference)
├── services/                   # Service modules
│   └── notificationService.js # Push notification service
├── contexts/                   # React contexts
│   └── ThemeContext.js        # Dark/light theme provider
├── config/                     # Configuration files
│   └── app.config.js          # API URL, refresh interval, version
├── components/                 # Reusable components (empty for now)
├── docs/                       # Documentation
├── assets/                     # Images, icons
├── package.json                # Dependencies
└── node_modules/               # Installed packages
```

### Current Status

**Working Features:**
- ✅ Portfolio summary display with P&L tracking
- ✅ Top 5 symbols by average profit
- ✅ Real-time data fetching from trading bot API
- ✅ Pull-to-refresh functionality
- ✅ Auto-refresh every 30 seconds (configurable)
- ✅ Proper iPhone notch/safe area handling
- ✅ Error handling and loading states
- ✅ Bottom tab navigation (3 tabs: Home, Signals, Settings)
- ✅ Full signals screen grouped by stock
- ✅ Individual signal detail screens
- ✅ Stack navigation for detail views
- ✅ Dark and light theme support
- ✅ Theme context with consistent styling
- ✅ Centralized configuration
- ✅ Strategy version fetched from API
- ✅ Push notification service integrated
- ✅ Token registration with backend
- ✅ Notification listeners configured

**Future Features:**
- ⏳ Charts and performance graphs
- ⏳ Push notification handling and navigation
- ⏳ Custom alert configuration
- ⏳ Historical performance analysis
- ⏳ WebSocket for real-time updates
- ⏳ Filter and sort signals
- ⏳ Search functionality

### Trading Bot Integration

The app connects to a Flask API running on the same local network:
- **API URL:** `http://192.168.1.253:5000` (configurable in `config/app.config.js`)
- **Endpoints Used:**
  - `/api/portfolio_summary` - Portfolio overview (P&L, allocation)
  - `/api/signals_by_stock` - All trading signals grouped by stock
  - `/api/version` - Current strategy version
  - `/api/positions` - Open positions (legacy, kept for reference)
  - `/api/register-push-token` - Register device push notification tokens

The trading bot tracks stocks using "Dad's Bollinger Strategy" (version displayed dynamically from API) and provides real-time data about signals being watched. The bot monitors signals without executing actual trades.

### Push Notification Setup

The app uses Expo's push notification service to receive notifications:

1. **Configuration:** Project ID configured in `app.json` (`60e6b6b9-cdf4-4fa0-a901-967e6395fcb3`)
2. **Permissions:** iOS and Android notification permissions requested on app startup
3. **Token Generation:** Expo generates a unique push token for each device
4. **Backend Registration:** Token is sent to trading bot backend via `/api/register-push-token`
5. **Graceful Degradation:** App works even if Expo's service is temporarily unavailable

The backend can use the registered tokens to send push notifications via Expo's Push API.
