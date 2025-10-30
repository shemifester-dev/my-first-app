# Project Overview

## Trading Dashboard Mobile App

This is a React Native mobile application built with Expo that displays real-time trading data from a Python-based trading bot.

### Project Purpose

The app provides a mobile interface to monitor trading positions, signals, and portfolio performance from your trading bot anywhere on your iPhone.

### Technology Stack

- **Framework:** React Native (via Expo)
- **Language:** JavaScript (React)
- **UI:** React Native components with custom styling
- **Navigation:** React Navigation (planned)
- **State Management:** React Hooks (useState, useEffect)
- **API Communication:** Fetch API
- **Safe Area Handling:** react-native-safe-area-context

### Key Features

1. **Portfolio Summary**
   - Total P&L (profit/loss percentage and dollars)
   - Number of open positions
   - Portfolio allocation percentage

2. **Position Monitoring**
   - View all open positions
   - Entry price, current price, quantity
   - Profit/loss for each position
   - Days held, stop-loss levels

3. **Trading Signals**
   - Historical trading signals
   - Signal type (BUY, SELL, BREAKOUT, BREAKDOWN)
   - Signal performance tracking

4. **Real-time Updates**
   - Auto-refresh every 30 seconds
   - Pull-to-refresh on all screens
   - Live connection to trading bot API

### Architecture

```
my-first-app/
├── App.js                 # Main app entry point
├── screens/               # Screen components
│   ├── HomeScreen.js      # Portfolio summary + top positions
│   ├── PositionsScreen.js # All positions (not active yet)
│   ├── SignalsScreen.js   # Trading signals (not active yet)
│   └── SettingsScreen.js  # App settings (not active yet)
├── components/            # Reusable components (empty for now)
├── docs/                  # Documentation
├── package.json           # Dependencies
└── node_modules/          # Installed packages
```

### Current Status

**Working Features:**
- ✅ Portfolio summary display
- ✅ Top 3 positions preview
- ✅ Real-time data fetching from trading bot API
- ✅ Pull-to-refresh functionality
- ✅ Auto-refresh every 30 seconds
- ✅ Proper iPhone notch/safe area handling
- ✅ Error handling and loading states

**Planned Features:**
- ⏳ Bottom tab navigation (4 screens)
- ⏳ Detailed positions screen
- ⏳ Full signals history screen
- ⏳ Settings and preferences
- ⏳ Push notifications for new signals
- ⏳ Charts and graphs
- ⏳ Individual position detail views

### Trading Bot Integration

The app connects to a Flask API running on the same local network:
- **API URL:** `http://192.168.1.253:5000`
- **Endpoints Used:**
  - `/api/portfolio_summary` - Portfolio overview
  - `/api/positions` - All open positions
  - `/api/signals_by_stock` - Trading signals history

The trading bot tracks stocks using "Dad's Bollinger Strategy v3.24" and provides real-time data about positions and signals.
