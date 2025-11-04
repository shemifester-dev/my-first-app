import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { config } from '../config/app.config';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark, toggleTheme } = useTheme();
  const [strategyVersion, setStrategyVersion] = useState('Loading...');

  useEffect(() => {
    fetchStrategyVersion();
  }, []);

  const fetchStrategyVersion = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/version`);
      if (response.ok) {
        const versionData = await response.json();
        setStrategyVersion(`Dad's Bollinger Strategy v${versionData.version}`);
      } else {
        setStrategyVersion('Unknown');
      }
    } catch (err) {
      console.error('Error fetching strategy version:', err);
      setStrategyVersion('Unknown');
    }
  };

  const openDashboard = () => {
    Linking.openURL(config.apiUrl);
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>App preferences and information</Text>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
              thumbColor={isDark ? '#ffffff' : '#f1f5f9'}
            />
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>App Name</Text>
            <Text style={styles.value}>{config.appName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>{config.appVersion}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Strategy</Text>
            <Text style={styles.value}>{strategyVersion}</Text>
          </View>
        </View>
      </View>

      {/* API Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>API URL</Text>
            <Text style={styles.valueSmall}>{config.apiUrl.replace('http://', '')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Refresh Interval</Text>
            <Text style={styles.value}>{config.refreshInterval / 1000} seconds</Text>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.button} onPress={openDashboard}>
          <Text style={styles.buttonText}>Open Web Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.infoText}>
          This app displays real-time trading data from your trading bot.
          Make sure your phone and trading bot are on the same WiFi network.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  valueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 8,
  },
  button: {
    backgroundColor: theme.tabActive,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoText: {
    fontSize: 14,
    color: theme.textTertiary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
