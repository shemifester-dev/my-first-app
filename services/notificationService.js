import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { config } from '../config/app.config';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Request permission and register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get the Expo push token
      // The projectId from app.json will be used automatically
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);

      this.expoPushToken = token;
      return token;
    } catch (error) {
      // Handle Expo server connectivity issues gracefully
      if (error.message && error.message.includes('503')) {
        console.log('Expo push notification service temporarily unavailable (503 error)');
        console.log('Push notifications will be registered when service is available');
      } else {
        console.error('Error getting push token:', error.message);
      }
      return null;
    }
  }

  // Send the push token to the trading bot backend
  async registerTokenWithBackend(token) {
    if (!token) return;

    try {
      const response = await fetch(`${config.apiUrl}/api/register-push-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          platform: Platform.OS,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Token registered with backend:', data);
      return data;
    } catch (error) {
      console.error('Error registering token with backend:', error);
      throw error;
    }
  }

  // Set up notification listeners
  setupNotificationListeners(onNotificationReceived, onNotificationTapped) {
    // Listener for when notification is received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      if (onNotificationTapped) {
        onNotificationTapped(response);
      }
    });
  }

  // Remove notification listeners
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Initialize the notification service
  async initialize() {
    try {
      // Register for push notifications and get token
      const token = await this.registerForPushNotificationsAsync();

      if (token) {
        // Send token to backend (optional - will fail gracefully if endpoint doesn't exist)
        try {
          await this.registerTokenWithBackend(token);
        } catch (backendError) {
          console.log('Could not register token with backend (endpoint may not exist yet):', backendError.message);
          console.log('Push notifications will still work, but backend won\'t be able to send them yet');
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new NotificationService();
