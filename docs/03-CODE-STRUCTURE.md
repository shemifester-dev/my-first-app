# Code Structure

## File Organization

```
my-first-app/
├── App.js                      # Main app entry point with navigation
├── index.js                    # Expo entry point (don't modify)
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependency versions
│
├── screens/                    # Screen components
│   ├── HomeScreen.js          # Portfolio summary + top 5 symbols
│   ├── SignalsScreen.js       # All signals grouped by stock
│   ├── SignalDetailScreen.js  # Individual signal details
│   ├── SettingsScreen.js      # App settings & theme toggle
│   ├── PositionDetailScreen.js # Legacy detail screen
│   └── PositionsScreen.js     # Legacy positions screen
│
├── contexts/                   # React contexts
│   └── ThemeContext.js        # Dark/light theme provider
│
├── config/                     # Configuration files
│   └── app.config.js          # API URL, refresh interval, version
│
├── components/                 # Reusable components (empty for now)
│
├── docs/                       # Documentation
│   ├── 01-PROJECT-OVERVIEW.md
│   ├── 02-SETUP-GUIDE.md
│   ├── 03-CODE-STRUCTURE.md   # This file
│   └── 04-API-INTEGRATION.md
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

The main entry point that sets up navigation and theme provider.

**Structure:**
```javascript
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// HomeStack - Navigation stack for Home tab
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PositionDetail" component={PositionDetailScreen} />
    </Stack.Navigator>
  );
}

// SignalsStack - Navigation stack for Signals tab
function SignalsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignalsMain" component={SignalsScreen} />
      <Stack.Screen name="SignalDetail" component={SignalDetailScreen} />
    </Stack.Navigator>
  );
}

// AppNavigator - Bottom tab navigation
function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Signals" component={SignalsStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// App - Wraps everything with providers
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

**Key concepts:**
- `ThemeProvider` - Provides theme context (dark/light) to all screens
- `SafeAreaProvider` - Provides safe area context for iPhone notch handling
- `NavigationContainer` - Root navigation component
- `Tab.Navigator` - Bottom tab navigation (3 tabs)
- `Stack.Navigator` - Stack navigation for detail screens

### contexts/ThemeContext.js

Manages dark and light theme state across the app.

**Structure:**
```javascript
import React, { createContext, useState, useContext } from 'react';

export const themes = {
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    text: '#ffffff',
    profit: '#10b981',
    loss: '#ef4444',
    // ... more colors
  },
  light: {
    background: '#f8fafc',
    cardBackground: '#ffffff',
    text: '#0f172a',
    profit: '#059669',
    loss: '#dc2626',
    // ... more colors
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

**Usage in screens:**
```javascript
const { theme, isDark, toggleTheme } = useTheme();

// Use theme colors
<View style={{ backgroundColor: theme.background }}>
  <Text style={{ color: theme.text }}>Hello</Text>
</View>

// Toggle theme
<Button onPress={toggleTheme} title="Toggle Theme" />
```

### config/app.config.js

Centralized configuration for the app.

**Content:**
```javascript
export const config = {
  apiUrl: 'http://192.168.1.253:5000',
  refreshInterval: 30000,  // 30 seconds
  appVersion: '1.1.0',
  appName: 'Trading Dashboard',
};
```

**Usage:**
```javascript
import { config } from '../config/app.config';

const response = await fetch(`${config.apiUrl}/api/portfolio_summary`);
const interval = setInterval(fetchData, config.refreshInterval);
```

### screens/HomeScreen.js

The main dashboard screen showing portfolio summary and top 5 symbols.

**Structure:**
```javascript
export default function HomeScreen({ navigation }) {
  // 1. Hooks
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // 2. State management
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [strategyVersion, setStrategyVersion] = useState('Loading...');

  // 3. Data fetching
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, config.refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    // Fetch portfolio summary
    // Fetch signals
    // Fetch strategy version
  };

  // 4. Dynamic styles
  const styles = getStyles(theme);

  // 5. Render UI
  return (
    <ScrollView style={styles.container}>
      {/* Portfolio Summary */}
      {/* Top 5 Symbols */}
    </ScrollView>
  );
}

// 6. Dynamic styles function
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  text: {
    color: theme.text,
  },
  // ... more styles
});
```

**Key features:**
- Uses `useTheme()` for dynamic theming
- Fetches from 3 endpoints: portfolio_summary, signals_by_stock, version
- Calculates average profit across multiple signals per symbol
- Sorts and displays top 5 symbols
- Dynamic styles based on current theme

### screens/SignalsScreen.js

Displays all trading signals grouped by stock symbol.

**Key features:**
- Fetches `/api/signals_by_stock` endpoint
- Groups signals by symbol (e.g., IHG has 2 signals)
- Shows signal type, date, price, today's profit/loss
- Color-coded badges (green for buy, red for sell)
- Tappable signals navigate to detail screen
- Sorted by most recent signal
- Uses theme for dynamic colors

**Navigation:**
```javascript
<TouchableOpacity
  onPress={() => navigation.navigate('SignalDetail', { signal, symbol: stock.symbol })}
>
  {/* Signal row content */}
</TouchableOpacity>
```

### screens/SignalDetailScreen.js

Shows comprehensive details for an individual signal.

**Displays:**
1. **Signal Information**
   - Signal type, date, price
   - Strategy version
   - Status

2. **Today's Performance**
   - Current price
   - Profit/loss percentage

3. **Historical Outcomes**
   - 1/3/7/14/30 day performance
   - Price and profit % for each period

4. **Technical Indicators**
   - All indicators from the signal
   - Resistance, support, breakout type, etc.

**Route params:**
```javascript
const { signal, symbol } = route.params;
```

### screens/SettingsScreen.js

App information and theme toggle.

**Features:**
- App version display (from config)
- API connection status
- Theme toggle button
- Link to open web dashboard
- About information

**Theme toggle:**
```javascript
const { isDark, toggleTheme } = useTheme();

<TouchableOpacity onPress={toggleTheme}>
  <Text>Toggle Theme (Currently: {isDark ? 'Dark' : 'Light'})</Text>
</TouchableOpacity>
```

## Component Patterns

### State Management with Hooks

```javascript
// Declare state
const [data, setData] = useState(initialValue);

// Update state
setData(newValue);

// State with objects
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
    const response = await fetch(`${config.apiUrl}/api/endpoint`);
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    setData(data);
    setError(null);
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

### Navigation

```javascript
// Navigate to screen in same stack
navigation.navigate('SignalDetail', { signal, symbol });

// Navigate to screen in different tab
navigation.navigate('Settings');

// Go back
navigation.goBack();
```

## Styling with Themes

React Native uses JavaScript objects for styling. We use dynamic styles based on theme:

```javascript
// Get theme
const { theme } = useTheme();

// Create dynamic styles
const styles = getStyles(theme);

// Styles function
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  text: {
    fontSize: 16,
    color: theme.text,
  },
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderColor: theme.border,
    borderWidth: 1,
  },
  profitText: {
    color: theme.profit,
  },
  lossText: {
    color: theme.loss,
  },
});

// Use styles
<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

// Combine styles
<Text style={[styles.text, styles.profitText]}>+5.2%</Text>

// Conditional styles
<Text style={[styles.text, isProfit ? styles.profitText : styles.lossText]}>
  {value}%
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
3. Makes HTTP request to `http://192.168.1.253:5000/api/signals_by_stock`
4. Gets JSON array of stocks with signals
5. Calls `setSignals(data)`
6. Component re-renders with new data
7. UI updates on iPhone screen

## Best Practices

### Component Organization

```javascript
export default function MyComponent() {
  // 1. Hooks first (useState, useEffect, useTheme, etc.)
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [data, setData] = useState(null);

  // 2. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Functions
  const handlePress = () => {
    console.log('Pressed!');
  };

  // 4. Dynamic styles
  const styles = getStyles(theme);

  // 5. Render (return JSX)
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}

// 6. Styles function at the bottom
const getStyles = (theme) => StyleSheet.create({
  // ...
});
```

### Naming Conventions

- **Components:** PascalCase (`HomeScreen`, `SignalDetailScreen`)
- **Functions:** camelCase (`fetchData`, `onRefresh`, `toggleTheme`)
- **Constants:** UPPER_SNAKE_CASE or camelCase (`API_URL`, `config`)
- **State variables:** camelCase (`signals`, `isLoading`, `portfolioSummary`)
- **Styles:** camelCase (`container`, `headerTitle`, `profitBadge`)

### Error Handling

Always wrap API calls in try-catch:

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed');
  const data = await response.json();
  setData(data);
  setError(null); // Clear previous errors
  setLoading(false);
} catch (err) {
  console.error('Error:', err);
  setError(err.message);
  setLoading(false);
}
```

### Performance

- Use `StyleSheet.create()` for styles (not inline objects)
- Use `getStyles(theme)` function to create styles based on theme
- Avoid unnecessary re-renders
- Clean up intervals/timers in useEffect cleanup
- Use `useMemo()` / `useCallback()` for expensive operations (future)

## Navigation Structure

```
App (ThemeProvider + SafeAreaProvider)
└── NavigationContainer
    └── Tab.Navigator (Bottom Tabs)
        ├── Home Tab
        │   └── HomeStack
        │       ├── HomeMain (HomeScreen)
        │       └── PositionDetail (PositionDetailScreen)
        │
        ├── Signals Tab
        │   └── SignalsStack
        │       ├── SignalsMain (SignalsScreen)
        │       └── SignalDetail (SignalDetailScreen)
        │
        └── Settings Tab
            └── SettingsScreen (no stack, direct component)
```

## Theme Colors Reference

**Dark Theme:**
```javascript
{
  background: '#0f172a',        // Dark blue-gray
  cardBackground: '#1e293b',    // Lighter blue-gray
  border: '#334155',            // Border color
  text: '#ffffff',              // White text
  textSecondary: '#94a3b8',     // Gray text
  textTertiary: '#64748b',      // Darker gray
  profit: '#10b981',            // Green
  loss: '#ef4444',              // Red
  profitBg: '#10b98120',        // Transparent green
  lossBg: '#ef444420',          // Transparent red
}
```

**Light Theme:**
```javascript
{
  background: '#f8fafc',        // Light gray
  cardBackground: '#ffffff',    // White
  border: '#e2e8f0',            // Light border
  text: '#0f172a',              // Dark text
  textSecondary: '#475569',     // Gray text
  textTertiary: '#94a3b8',      // Lighter gray
  profit: '#059669',            // Darker green
  loss: '#dc2626',              // Darker red
  profitBg: '#d1fae5',          // Light green
  lossBg: '#fee2e2',            // Light red
}
```

## Next Steps

- **Custom Hooks:** Extract data fetching logic into `useTrading()` hook
- **Component Library:** Create reusable `SignalCard`, `PerformanceCard` components
- **TypeScript:** Add type safety (optional)
- **Testing:** Add unit tests with Jest
- **Performance:** Optimize re-renders with `useMemo` and `useCallback`
