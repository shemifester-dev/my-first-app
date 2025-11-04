import { StyleSheet, Text, View, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { config } from '../config/app.config';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [strategyVersion, setStrategyVersion] = useState('Loading...');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, config.refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);
      setError(null);

      const summaryResponse = await fetch(`${config.apiUrl}/api/portfolio_summary`);
      if (!summaryResponse.ok) throw new Error('Portfolio API failed');
      const summaryData = await summaryResponse.json();
      setPortfolioSummary(summaryData);

      const signalsResponse = await fetch(`${config.apiUrl}/api/signals_by_stock`);
      if (!signalsResponse.ok) throw new Error('Signals API failed');
      const signalsData = await signalsResponse.json();

      // Sort by most recent signal and take top stocks
      if (Array.isArray(signalsData)) {
        signalsData.sort((a, b) => {
          const latestA = a.signals && a.signals.length > 0
            ? new Date(a.signals[0].signal_date)
            : new Date(0);
          const latestB = b.signals && b.signals.length > 0
            ? new Date(b.signals[0].signal_date)
            : new Date(0);
          return latestB - latestA;
        });
      }

      setSignals(signalsData);

      // Fetch current strategy version from dedicated endpoint
      try {
        const versionResponse = await fetch(`${config.apiUrl}/api/version`);
        if (versionResponse.ok) {
          const versionData = await versionResponse.json();
          setStrategyVersion(`Dad's Bollinger Strategy v${versionData.version}`);
        }
      } catch (versionErr) {
        console.error('Error fetching version:', versionErr);
      }

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to connect: ${err.message}`);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchData(true);
  };

  const styles = getStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Dashboard</Text>
        <Text style={styles.headerSubtitle}>{strategyVersion}</Text>
      </View>

      {loading && (
        <View style={styles.section}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      )}

      {error && (
        <View style={styles.section}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.emptySubtext}>Make sure you're on the same WiFi network</Text>
          </View>
        </View>
      )}

      {/* Portfolio Summary */}
      {!loading && !error && portfolioSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Summary</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active Signals</Text>
              <Text style={styles.statValue}>{signals.reduce((sum, stock) => sum + (stock.signals?.length || 0), 0)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total P&L</Text>
              <Text style={[styles.statValue, portfolioSummary.overall_pl_pct >= 0 ? styles.profitText : styles.lossText]}>
                {portfolioSummary.overall_pl_pct >= 0 ? '+' : ''}{portfolioSummary.overall_pl_pct.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Profit/Loss</Text>
              <Text style={[styles.statValue, portfolioSummary.total_profit_dollars >= 0 ? styles.profitText : styles.lossText]}>
                ${portfolioSummary.total_profit_dollars >= 0 ? '+' : ''}{portfolioSummary.total_profit_dollars.toFixed(0)}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Allocated</Text>
              <Text style={styles.statValue}>{portfolioSummary.total_allocated_pct.toFixed(1)}%</Text>
            </View>
          </View>
        </View>
      )}

      {/* Top Symbols Performance */}
      {!loading && !error && signals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Symbols (by avg today profit)</Text>
          {signals
            .map(stock => {
              // Calculate average profit across all signals for this stock
              let avgProfit = 0;
              if (stock.signals && stock.signals.length > 0) {
                const validSignals = stock.signals.filter(s => s.today?.profit_pct !== undefined);
                if (validSignals.length > 0) {
                  const sum = validSignals.reduce((acc, s) => acc + (s.today.profit_pct || 0), 0);
                  avgProfit = sum / validSignals.length;
                }
              }
              return { ...stock, avgProfit };
            })
            .sort((a, b) => b.avgProfit - a.avgProfit)
            .slice(0, 5)
            .map((stock, index) => {
              const isProfit = stock.avgProfit >= 0;
              return (
                <View key={index} style={[styles.card, { marginBottom: 12 }]}>
                  <View style={styles.signalPerformanceRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.symbolText}>{stock.symbol}</Text>
                      <Text style={styles.signalCountText}>
                        {stock.signals?.length || 0} signal{stock.signals?.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={[styles.profitBadge, isProfit ? styles.profitBg : styles.lossBg]}>
                      <Text style={[styles.profitBadgeText, { color: isProfit ? '#10b981' : '#ef4444' }]}>
                        {stock.avgProfit >= 0 ? '+' : ''}{stock.avgProfit.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      )}

    </ScrollView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    paddingTop: 20,
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
  signalPerformanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  signalCountText: {
    fontSize: 12,
    color: theme.textTertiary,
  },
  profitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  profitBadgeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  profitBg: {
    backgroundColor: theme.profitBg,
  },
  lossBg: {
    backgroundColor: theme.lossBg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  profitText: {
    color: theme.profit,
  },
  lossText: {
    color: theme.loss,
  },
  emptyText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textTertiary,
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.loss,
  },
  errorText: {
    fontSize: 16,
    color: theme.loss,
    textAlign: 'center',
    marginBottom: 4,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});
