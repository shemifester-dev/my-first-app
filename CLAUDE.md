# Claude Development Notes

This document contains notes for Claude (or other AI assistants) when working on this project.

## Project Context

This is a **React Native mobile app** built with **Expo** for monitoring a Python-based trading bot. The user (Shemi) is learning mobile development for the first time.

### User's Experience Level
- **Python:** Experienced (has built a trading bot)
- **React Native/JavaScript:** Beginner (first mobile app)
- **Mobile Development:** First project
- **Environment:** Ubuntu + iPhone (iOS)

### Development Setup
- **Platform:** Ubuntu Linux
- **Device:** iPhone (testing with Expo Go)
- **Network:** Local network (192.168.1.253)
- **Trading Bot:** Python/Flask running in Docker
- **Node Version:** v18.19.1 (works but warnings about v20+)

## Current Status (October 30, 2025)

### What's Working ✅
1. **Basic app structure** - Single screen with ScrollView
2. **API integration** - Fetches data from trading bot at `http://192.168.1.253:5000`
3. **Portfolio summary** - Shows P&L, positions count, allocation
4. **Position preview** - Top 3 positions displayed
5. **Auto-refresh** - Every 30 seconds via setInterval
6. **Pull-to-refresh** - Manual refresh via RefreshControl
7. **Safe area handling** - iPhone notch handled correctly with useSafeAreaInsets()
8. **Error handling** - Network errors displayed to user
9. **Loading states** - Loading and refreshing indicators

### What's Not Working / Incomplete ❌
1. **Navigation** - Tab navigation was attempted but caused errors:
   - "Unable to resolve module BottomTabBar"
   - "HostFunction error: expected boolean but had string"
   - Reverted to single screen for stability

2. **Multiple screens** - PositionsScreen, SignalsScreen, SettingsScreen exist but not accessible
3. **Push notifications** - Not implemented
4. **Charts/graphs** - Not implemented
5. **Position details** - No drill-down views

## Technical Decisions & Lessons Learned

### What Worked
- **Expo** - Good choice for first mobile app, easy to test on iPhone
- **useSafeAreaInsets()** - Proper way to handle iPhone notch (not SafeAreaView with edges prop)
- **Simple state management** - useState + useEffect sufficient for now
- **Direct API calls** - fetch() works fine, no need for axios yet
- **Flat file structure** - screens/ folder keeps it organized

### What Didn't Work
- **React Navigation integration** - Caused mysterious errors
  - Possibly version compatibility issues
  - Error messages were cryptic
  - Cache clearing didn't help
  - Decision: Reverted to single screen, will retry later

- **SafeAreaView with edges prop** - Caused errors
  - Better to use regular View + useSafeAreaInsets()

- **Background bash processes** - My attempts to run expo in background caused confusion
  - Better to let user run in their own terminal

### Trading Bot API Issues Fixed
1. **Port binding** - Changed from `127.0.0.1:5000` to `0.0.0.0:5000` in docker-compose.yml
2. **Position API bug** - Fixed `entry_time` vs `entry_date` attribute name
3. **Position API bug** - Fixed `exited_50pct` vs `profit_taken_50pct` attribute name
4. **Date handling** - entry_date is already a string, doesn't need .isoformat()
5. **Dashboard mount** - Added `./dashboard.py:/app/dashboard.py` volume mount for live updates

## File Locations & Structure

```
~/Dev/my-first-app/           # Mobile app (this project)
├── App.js                     # Main entry - renders HomeScreen in SafeAreaProvider
├── screens/
│   ├── HomeScreen.js          # Active - portfolio summary + top 3 positions
│   ├── PositionsScreen.js     # Created but not accessible (needs navigation)
│   ├── SignalsScreen.js       # Created but not accessible (needs navigation)
│   └── SettingsScreen.js      # Created but not accessible (needs navigation)
├── docs/                      # Comprehensive documentation
└── package.json               # Dependencies

~/Dev/trading-bot/             # Existing trading bot project
├── dashboard.py               # Flask API server
├── docker-compose.yml         # Docker config (modified for network access)
└── logs/
    ├── positions.json         # Open positions data
    └── signal_outcomes.json   # Trading signals data
```

## API Integration Details

### Base URL
```javascript
const API_URL = 'http://192.168.1.253:5000';
```

### Endpoints Used
1. `/api/portfolio_summary` - Portfolio overview (position count, P&L, allocation)
2. `/api/positions` - Array of open positions
3. `/api/signals_by_stock` - Array of stocks with nested signals array

### Data Flow
```
Trading Bot (Python/Flask in Docker)
    ↓
Flask API (port 5000, bound to 0.0.0.0)
    ↓
Network (192.168.1.253:5000)
    ↓
React Native fetch()
    ↓
useState() stores data
    ↓
Component renders
    ↓
iPhone displays via Expo Go
```

## Common Issues & Solutions

### "Unable to resolve module" errors
- **Cause:** Metro bundler cache
- **Solution:** `npx expo start --clear` or press Shift+C in terminal

### "Failed to connect to trading bot"
- **Cause:** API not accessible from network
- **Solution:** Check docker-compose.yml has `0.0.0.0:5000:5000`, restart dashboard

### "JSON parse error" or "expected boolean but had string"
- **Cause:** Usually prop type mismatch or API returning HTML error page
- **Solution:** Check API in browser first, verify response is JSON

### Title masked by iPhone notch
- **Cause:** Not accounting for safe area
- **Solution:** Use `contentContainerStyle={{ paddingTop: insets.top }}` in ScrollView

### App not reloading after code changes
- **Cause:** Metro bundler cache
- **Solution:** Shake iPhone → Reload, or clear cache with Shift+C

## Development Workflow

### Making Changes
1. User runs `npx expo start` in their terminal (NOT via my background processes)
2. User edits code in IDE
3. App auto-reloads on save
4. If issues: Shake iPhone → Reload
5. If still issues: Terminal → press `r` or `Shift+C`

### Adding New Features
1. Start simple - single file, single component
2. Test thoroughly on iPhone before proceeding
3. If errors occur:
   - Check terminal for error details
   - Check iPhone error message
   - Try clearing cache
   - Simplify/revert if needed
4. Document what works and what doesn't

### When User Gets Frustrated
- **Simplify** - Remove complexity, get back to working state
- **Explain** - Show what's happening, don't just fix blindly
- **Document** - Write down what we learned
- **Progress** - Even small wins count

## Next Steps (Ordered by Priority)

### High Priority
1. **Fix navigation** - Retry React Navigation carefully
   - Use simpler approach
   - Test each step
   - Don't add all screens at once
   - Consider using createStackNavigator first (simpler than tabs)

2. **Enable other screens** - Once navigation works
   - Positions screen (already created)
   - Signals screen (already created)
   - Settings screen (already created)

### Medium Priority
3. **Add charts** - Victory Native for React Native
4. **Push notifications** - Expo Notifications API
5. **Position detail screen** - Tap position to see full details

### Low Priority
6. **Settings** - Dark/light theme, refresh interval
7. **Alerts** - Custom price alerts
8. **Historical data** - Performance over time

## Code Patterns to Follow

### State Management
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### API Calls
```javascript
try {
  const response = await fetch(`${API_URL}/endpoint`);
  if (!response.ok) throw new Error('API failed');
  const data = await response.json();
  setData(data);
  setError(null);
} catch (err) {
  setError(err.message);
}
```

### Component Structure
```javascript
export default function MyScreen() {
  // 1. Hooks
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null);

  // 2. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Functions
  const fetchData = async () => { /* ... */ };

  // 4. Render
  return ( /* JSX */ );
}

// 5. Styles
const styles = StyleSheet.create({ /* ... */ });
```

### Styling
- Use `StyleSheet.create()` not inline objects
- Dark theme colors: background `#0f172a`, cards `#1e293b`
- Green for profit `#10b981`, red for loss `#ef4444`
- Always add `paddingTop: insets.top` to first scrollable element

## Important Reminders for Claude

1. **User is learning** - Explain concepts, don't just code
2. **Test on iPhone** - Always ask user to test after changes
3. **One thing at a time** - Don't add multiple features simultaneously
4. **Document issues** - Keep track of what didn't work
5. **Simplify when stuck** - Better to have working simple app than broken complex one
6. **Check background processes** - Sometimes my background expo processes interfere
7. **API IP address** - Will change if user's network changes, needs update in code
8. **Trading bot must be running** - Docker containers need to be up

## Git Strategy

### Not Yet Initialized
- Project not in git yet (user requested this be added)
- Will need .gitignore for:
  - node_modules/
  - .expo/
  - .expo-shared/
  - npm-debug.*
  - *.jks
  - *.p8
  - *.p12
  - *.key
  - *.mobileprovision

### Planned Git Workflow
1. Initialize repo: `git init`
2. Add .gitignore
3. Initial commit with all working code
4. Branch strategy: main for stable, feature branches for experiments
5. Commit messages in format: "feat: description" or "fix: description"

## Communication Tips

### When User Says "What do you want from me?"
- They're confused about what action to take
- Be specific: "In your Ubuntu terminal, type: <exact command>"
- Or: "On your iPhone, do: <exact steps>"
- Don't ask vague questions

### When User Says "You're making me crazy"
- We're stuck in a loop or things aren't working
- **Stop and simplify**
- Explain what went wrong
- Offer to revert to last working state
- Take a break if needed

### Good Communication
- ✅ "In your terminal, press `r` to reload"
- ✅ "On your iPhone, shake it and tap Reload"
- ✅ "Check your terminal for errors and tell me what you see"
- ❌ "Try reloading" (too vague)
- ❌ "Does it work?" (asks for testing without context)

## Session History Summary

This was the first session building this app:
1. Started with Expo initialization
2. Built single-screen portfolio dashboard
3. Integrated with trading bot API (fixed several API bugs)
4. Added pull-to-refresh and auto-refresh
5. Fixed iPhone notch masking issue
6. Attempted navigation (failed - errors)
7. Reverted to working single screen
8. Created comprehensive documentation
9. Next: Add to git, then retry navigation

**Total time:** ~3 hours
**Result:** Working mobile app with real trading data!

## Final Notes

This was a successful first mobile app project despite some challenges. The user learned:
- React Native basics
- State management with hooks
- API integration
- iPhone development quirks
- Debugging mobile apps

Key insight: **Keep it simple**. Better to have a working simple app than a broken complex one. Build features incrementally and test each step.

---

**For future Claude sessions:** Read this file first to understand context and avoid repeating mistakes!
