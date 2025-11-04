import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';

import HomeScreen from './screens/HomeScreen';
import SignalsScreen from './screens/SignalsScreen';
import SettingsScreen from './screens/SettingsScreen';
import PositionDetailScreen from './screens/PositionDetailScreen';
import SignalDetailScreen from './screens/SignalDetailScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import notificationService from './services/notificationService';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack Navigator
function HomeStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="PositionDetail"
        component={PositionDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.text,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

// Signals Stack Navigator
function SignalsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignalsMain" component={SignalsScreen} />
      <Stack.Screen
        name="SignalDetail"
        component={SignalDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.text,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.tabBarBorder,
            borderTopWidth: 1,
            paddingBottom: 25,
            paddingTop: 5,
            height: 85,
          },
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Signals" component={SignalsStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize push notifications on app startup
    const initializeNotifications = async () => {
      try {
        const success = await notificationService.initialize();
        if (success) {
          console.log('Push notifications initialized successfully');
        } else {
          console.log('Failed to initialize push notifications');
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    initializeNotifications();

    // Set up notification listeners
    notificationService.setupNotificationListeners(
      (notification) => {
        // Handle notification received while app is running
        console.log('Received notification:', notification.request.content);
      },
      (response) => {
        // Handle notification tapped
        console.log('User tapped notification:', response.notification.request.content);
        // You can navigate to specific screen based on notification data here
      }
    );

    // Clean up listeners on unmount
    return () => {
      notificationService.removeNotificationListeners();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
