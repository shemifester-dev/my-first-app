import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import PositionsScreen from './screens/PositionsScreen';
import SignalsScreen from './screens/SignalsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#1e293b',
              borderTopColor: '#334155',
              borderTopWidth: 1,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Positions" component={PositionsScreen} />
          <Tab.Screen name="Signals" component={SignalsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
