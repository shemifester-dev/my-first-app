# API Integration Guide

## Trading Bot API Overview

The mobile app connects to the Flask API running on your trading bot to fetch real-time data.

### API Base URL

```javascript
const API_URL = 'http://192.168.1.253:5000';
```

**Important:** This IP address must match your Ubuntu machine's local IP on the network.

## Available Endpoints

### 1. Portfolio Summary

**Endpoint:** `GET /api/portfolio_summary`

**Response:**
```json
{
  "portfolio_value": 100000,
  "position_count": 5,
  "max_positions": 25,
  "available_slots": 20,
  "total_allocated_dollars": 20833.33,
  "total_allocated_pct": 20.83,
  "total_position_value": 76666.0,
  "total_profit_dollars": 1411.0,
  "overall_pl_pct": 1.84
}
```

**Used in:** HomeScreen.js

**Display:**
- Open Positions count
- Total P&L percentage
- Profit/Loss in dollars
- Allocated percentage

### 2. Open Positions

**Endpoint:** `GET /api/positions`

**Response:**
```json
[
  {
    "symbol": "WTFC",
    "entry_price": 128.5,
    "current_price": 127.68,
    "quantity": 100.0,
    "profit_pct": -0.64,
    "profit_dollars": -82.0,
    "current_stop": 120.83,
    "initial_stop": 119.61,
    "strategy": "Dad's Bollinger Bands Strategy v3.32",
    "entry_date": "2025-10-21T19:25:09.480659",
    "profit_taken_50pct": false,
    "days_held": 8
  },
  // ... more positions
]
```

**Used in:** HomeScreen.js, PositionsScreen.js

**Display:**
- Symbol (stock ticker)
- Entry and current prices
- Quantity of shares
- Profit/loss (% and $)
- Stop-loss level
- Strategy used
- Days held

### 3. Trading Signals

**Endpoint:** `GET /api/signals_by_stock`

**Response:**
```json
[
  {
    "symbol": "BHP",
    "total_signals": 1,
    "complete_signals": 0,
    "avg_profit_7d": null,
    "signals": [
      {
        "signal_id": "BHP_BREAKOUT_20251027_170219",
        "signal_type": "BREAKOUT",
        "signal_price": 56.30,
        "signal_date": "2025-10-27T17:02:19.500043",
        "strategy": "Consolidation Screening",
        "strategy_version": "3.22a",
        "status": "partial",
        "outcomes": {
          "1_day": {
            "price": 57.13,
            "profit_pct": -1.47,
            "target_date": "2025-10-28T00:00:00-04:00"
          },
          "3_day": null,
          "7_day": null,
          "30_day": null
        },
        "today": {
          "price": 57.96,
          "profit_pct": 2.95
        }
      }
    ]
  }
]
```

**Used in:** SignalsScreen.js

**Display:**
- Symbol
- Signal type (BUY, SELL, BREAKOUT, BREAKDOWN)
- Signal price and date
- Current price and performance
- Strategy version

### 4. Config (Not Currently Used)

**Endpoint:** `GET /api/config`

Returns strategy configuration and monitoring status.

### 5. Position Alerts (Not Currently Used)

**Endpoint:** `GET /api/position_alerts`

Returns alerts for stop-loss warnings and profit target hits.

## Making API Calls

### Basic Fetch Pattern

```javascript
const fetchData = async () => {
  try {
    // 1. Make HTTP request
    const response = await fetch(`${API_URL}/api/portfolio_summary`);

    // 2. Check if response is ok
    if (!response.ok) {
      throw new Error('API request failed');
    }

    // 3. Parse JSON
    const data = await response.json();

    // 4. Update state
    setPortfolioSummary(data);
    setError(null);

  } catch (err) {
    // 5. Handle errors
    console.error('Error:', err);
    setError(`Failed to connect: ${err.message}`);
  }
};
```

### With Loading States

```javascript
const fetchData = async (isRefreshing = false) => {
  try {
    // Show appropriate loading indicator
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    // Clear previous errors
    setError(null);

    // Fetch data
    const response = await fetch(`${API_URL}/api/positions`);
    if (!response.ok) throw new Error('Positions API failed');
    const data = await response.json();

    // Update state
    setPositions(data);

  } catch (err) {
    setError(err.message);
  } finally {
    // Always turn off loading
    setLoading(false);
    setRefreshing(false);
  }
};
```

### Multiple Parallel Requests

```javascript
const fetchAllData = async () => {
  try {
    // Fetch multiple endpoints in parallel
    const [summaryRes, positionsRes, signalsRes] = await Promise.all([
      fetch(`${API_URL}/api/portfolio_summary`),
      fetch(`${API_URL}/api/positions`),
      fetch(`${API_URL}/api/signals_by_stock`)
    ]);

    // Check all responses
    if (!summaryRes.ok || !positionsRes.ok || !signalsRes.ok) {
      throw new Error('One or more API calls failed');
    }

    // Parse all JSON
    const [summary, positions, signals] = await Promise.all([
      summaryRes.json(),
      positionsRes.json(),
      signalsRes.json()
    ]);

    // Update all state
    setPortfolioSummary(summary);
    setPositions(positions);
    setSignals(signals);

  } catch (err) {
    setError(err.message);
  }
};
```

## Auto-Refresh Pattern

### Using setInterval

```javascript
useEffect(() => {
  // Fetch immediately on mount
  fetchData();

  // Set up interval for auto-refresh
  const interval = setInterval(() => {
    fetchData();
  }, 30000); // Every 30 seconds

  // Cleanup function
  return () => {
    clearInterval(interval); // Stop interval when component unmounts
  };
}, []); // Empty dependency array = run once on mount
```

### Pull-to-Refresh

```javascript
// State for refresh indicator
const [refreshing, setRefreshing] = useState(false);

// Handler function
const onRefresh = () => {
  fetchData(true); // Pass true to show refreshing state
};

// In ScrollView
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#ffffff" // Spinner color
    />
  }
>
  {/* Content */}
</ScrollView>
```

## Error Handling

### Network Errors

Common errors and how to handle them:

```javascript
try {
  const response = await fetch(url);

  // HTTP error (404, 500, etc.)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

} catch (err) {
  // Network error (no internet, server down, etc.)
  if (err.message.includes('Failed to fetch')) {
    setError('Cannot connect to trading bot. Check network connection.');
  }
  // JSON parse error
  else if (err.message.includes('JSON')) {
    setError('Invalid response from server');
  }
  // Other errors
  else {
    setError(`Error: ${err.message}`);
  }
}
```

### Displaying Errors to User

```javascript
{error && (
  <View style={styles.errorCard}>
    <Text style={styles.errorText}>{error}</Text>
    <Text style={styles.errorSubtext}>
      Make sure you're on the same WiFi network
    </Text>
  </View>
)}
```

## Data Processing

### Transforming Signals Data

The signals endpoint returns data grouped by stock. We need to flatten it:

```javascript
const signalsResponse = await fetch(`${API_URL}/api/signals_by_stock`);
const signalsData = await signalsResponse.json();

// Flatten signals from all stocks
const allSignals = [];
signalsData.forEach(stock => {
  stock.signals.forEach(signal => {
    allSignals.push({
      ...signal,
      symbol: stock.symbol, // Add symbol from parent
      timestamp: signal.signal_date || signal.timestamp
    });
  });
});

// Sort by newest first
allSignals.sort((a, b) => {
  return new Date(b.timestamp) - new Date(a.timestamp);
});

// Take top 5
setSignals(allSignals.slice(0, 5));
```

### Calculating Derived Values

```javascript
// Format currency
const formatCurrency = (value) => {
  return `$${value >= 0 ? '+' : ''}${value.toFixed(0)}`;
};

// Format percentage
const formatPercent = (value) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

## Testing API Locally

### Using curl

```bash
# Test portfolio summary
curl http://192.168.1.253:5000/api/portfolio_summary | python3 -m json.tool

# Test positions
curl http://192.168.1.253:5000/api/positions | python3 -m json.tool

# Test signals
curl http://192.168.1.253:5000/api/signals_by_stock | python3 -m json.tool
```

### Using browser

Open in browser:
- http://192.168.1.253:5000/api/portfolio_summary
- http://192.168.1.253:5000/api/positions
- http://192.168.1.253:5000/api/signals_by_stock

## Troubleshooting

### "Failed to connect"

1. Check trading bot is running: `docker ps | grep dashboard`
2. Check API is accessible: `curl http://192.168.1.253:5000/health`
3. Verify iPhone is on same WiFi
4. Check firewall isn't blocking port 5000

### "JSON parse error"

1. API might be returning HTML error page
2. Check API endpoint in browser
3. Look at response: `curl -v http://192.168.1.253:5000/api/positions`

### Data not updating

1. Check auto-refresh is working (should update every 30 seconds)
2. Try manual pull-to-refresh
3. Check terminal for error logs
4. Verify trading bot is updating data

## Future Enhancements

**Planned API features:**
- WebSocket for real-time updates (instead of polling)
- Push notifications endpoint
- Historical performance data
- Custom alert configuration
- Trade execution from mobile (careful!)
