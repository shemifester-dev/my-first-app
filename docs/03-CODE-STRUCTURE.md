# Code Structure

## File Organization

```
my-first-app/
├── App.js                      # Main app entry point
├── index.js                    # Expo entry point (don't modify)
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependency versions
│
├── screens/                    # Screen components
│   ├── HomeScreen.js          # Portfolio summary + positions preview
│   ├── PositionsScreen.js     # Full positions list (not active)
│   ├── SignalsScreen.js       # Trading signals (not active)
│   └── SettingsScreen.js      # App settings (not active)
│
├── components/                 # Reusable components (empty for now)
│
├── docs/                       # Documentation
│   ├── 01-PROJECT-OVERVIEW.md
│   ├── 02-SETUP-GUIDE.md
│   └── 03-CODE-STRUCTURE.md   # This file
│
├── assets/                     # Images, icons, fonts
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
│
├── node_modules/               # Installed packages (don't modify)
└── .expo/                      # Expo cache (don't modify)
```

## Key Files Explained

### App.js

The main entry point that renders the entire app.

**Current structure:**
```javascript
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}
```

**Key concepts:**
- `SafeAreaProvider` - Provides safe area context for iPhone notch handling
- `StatusBar` - Controls the status bar appearance (light text on dark background)
- `HomeScreen` - The main screen component

### screens/HomeScreen.js

The main dashboard screen showing portfolio summary and top positions.

**Structure:**
```javascript
export default function HomeScreen() {
  // 1. Safe area insets (for notch handling)
  const insets = useSafeAreaInsets();

  // 2. State management
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 3. Data fetching on mount and interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Every 30 seconds
    return () => clearInterval(interval); // Cleanup
  }, []);

  // 4. API calls
  const fetchData = async (isRefreshing = false) => {
    // Fetch from trading bot API
  };

  // 5. Pull-to-refresh handler
  const onRefresh = () => {
    fetchData(true);
  };

  // 6. Render UI
  return (
    <ScrollView>
      {/* Portfolio summary, positions, etc. */}
    </ScrollView>
  );
}
```

**Key features:**
- `useSafeAreaInsets()` - Gets safe area padding for notch
- `useState()` - Manages component state
- `useEffect()` - Runs side effects (data fetching, intervals)
- `fetch()` - Makes HTTP requests to trading bot API
- `ScrollView` - Scrollable container
- `RefreshControl` - Pull-to-refresh functionality

### screens/PositionsScreen.js

Shows all open positions with detailed information.

**Features:**
- Fetches `/api/positions` endpoint
- Displays each position in a card
- Shows: symbol, strategy, entry/current price, P&L, stop-loss, days held
- Pull-to-refresh and auto-refresh
- Currently not visible (navigation disabled)

### screens/SignalsScreen.js

Displays all trading signals with performance tracking.

**Features:**
- Fetches `/api/signals_by_stock` endpoint
- Shows signal type (BUY, SELL, BREAKOUT, BREAKDOWN)
- Color-coded badges (green for buy, red for sell)
- Shows current profit/loss for each signal
- Sorted by most recent first
- Currently not visible (navigation disabled)

### screens/SettingsScreen.js

App information and settings.

**Features:**
- App version and info
- API connection details
- Link to open web dashboard
- Currently not visible (navigation disabled)

## Component Patterns

### State Management with Hooks

```javascript
// Declare state
const [data, setData] = useState(initialValue);

// Update state
setData(newValue);

// State in objects
const [user, setUser] = useState({ name: '', age: 0 });
setUser({ ...user, name: 'John' }); // Spread to preserve other fields
```

### Side Effects with useEffect

```javascript
// Run once on mount
useEffect(() => {
  fetchData();
}, []); // Empty dependency array

// Run when variable changes
useEffect(() => {
  console.log('Count changed:', count);
}, [count]); // Re-run when count changes

// Cleanup on unmount
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

### API Calls

```javascript
const fetchData = async () => {
  try {
    const response = await fetch('http://api.example.com/data');
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    setData(data);
  } catch (err) {
    console.error('Error:', err);
    setError(err.message);
  }
};
```

### Conditional Rendering

```javascript
// Show loading
{loading && <Text>Loading...</Text>}

// Show error
{error && <Text>{error}</Text>}

// Show content when ready
{!loading && !error && data && (
  <View>
    <Text>{data.value}</Text>
  </View>
)}
```

## Styling

React Native uses JavaScript objects for styling, similar to CSS but with camelCase property names.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Take full space
    backgroundColor: '#0f172a',  // Dark blue
  },
  text: {
    fontSize: 16,               // 16px
    color: '#ffffff',           // White
    fontWeight: '600',          // Semi-bold
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,           // Rounded corners
    padding: 16,                // Internal spacing
    marginBottom: 12,           // External spacing
  },
});

// Use styles
<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

// Combine styles
<Text style={[styles.text, styles.bold]}>Bold text</Text>

// Conditional styles
<Text style={[styles.text, isProfit ? styles.green : styles.red]}>
  P&L
</Text>
```

## Data Flow

```
Trading Bot (Python/Flask)
         ↓
    API Endpoint (JSON)
         ↓
    fetch() in React Native
         ↓
    useState() stores data
         ↓
    Render UI with data
         ↓
    User sees on iPhone
```

**Example flow:**

1. `useEffect()` runs on mount
2. Calls `fetchData()`
3. Makes HTTP request to `http://192.168.1.253:5000/api/portfolio_summary`
4. Gets JSON: `{ position_count: 5, overall_pl_pct: 1.84, ... }`
5. Calls `setPortfolioSummary(data)`
6. Component re-renders with new data
7. UI updates on iPhone screen

## Best Practices

### Component Organization

```javascript
export default function MyComponent() {
  // 1. Hooks first (useState, useEffect, etc.)
  const [data, setData] = useState(null);

  // 2. Functions
  const handlePress = () => {
    console.log('Pressed!');
  };

  // 3. Render (return JSX)
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}

// 4. Styles at the bottom
const styles = StyleSheet.create({
  // ...
});
```

### Naming Conventions

- **Components:** PascalCase (`HomeScreen`, `PositionCard`)
- **Functions:** camelCase (`fetchData`, `onRefresh`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`)
- **State variables:** camelCase (`positions`, `isLoading`)

### Error Handling

Always wrap API calls in try-catch:

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed');
  const data = await response.json();
  setData(data);
  setError(null); // Clear previous errors
} catch (err) {
  console.error('Error:', err);
  setError(err.message);
}
```

### Performance

- Use `StyleSheet.create()` for styles (not inline objects)
- Avoid unnecessary re-renders
- Clean up intervals/timers in useEffect cleanup
- Use `useMemo()` / `useCallback()` for expensive operations (future)

## Next Steps

- **Add Navigation:** React Navigation with bottom tabs
- **Component Library:** Create reusable PositionCard, SignalCard components
- **Custom Hooks:** Extract data fetching logic into useTrading() hook
- **Context API:** Share data between screens without prop drilling
- **TypeScript:** Add type safety (optional)
