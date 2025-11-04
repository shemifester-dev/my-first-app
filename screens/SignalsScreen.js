import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { config } from '../config/app.config';
import { useTheme } from '../contexts/ThemeContext';

export default function SignalsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, config.refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);
      setError(null);

      const signalsResponse = await fetch(`${config.apiUrl}/api/signals_by_stock`);
      if (!signalsResponse.ok) throw new Error('Signals API failed');
      const signalsData = await signalsResponse.json();

      // Keep data grouped by stock, sort by most recent signal
      if (Array.isArray(signalsData)) {
        signalsData.sort((a, b) => {
          const latestA = a.signals && a.signals.length > 0
            ? new Date(a.signals[0].signal_date || a.signals[0].timestamp)
            : new Date(0);
          const latestB = b.signals && b.signals.length > 0
            ? new Date(b.signals[0].signal_date || b.signals[0].timestamp)
            : new Date(0);
          return latestB - latestA;
        });
      }

      setSignals(signalsData);
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

  const getSignalColor = (signalType) => {
    if (signalType === 'BUY' || signalType === 'BREAKOUT') {
      return theme.profit;
    }
    return theme.loss;
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Signals</Text>
        <Text style={styles.headerSubtitle}>
          {signals.length} stocks • {signals.reduce((sum, stock) => sum + (stock.signals?.length || 0), 0)} signals
        </Text>
      </View>

      {loading && (
        <View style={styles.section}>
          <Text style={styles.emptyText}>Loading signals...</Text>
        </View>
      )}

      {error && (
        <View style={styles.section}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      )}

      {!loading && !error && signals.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.emptyText}>No signals yet</Text>
          <Text style={styles.emptySubtext}>Signals will appear here when detected</Text>
        </View>
      )}

      {!loading && !error && signals.length > 0 && (
        <View style={styles.section}>
          {signals.map((stock, stockIndex) => (
            <View key={stockIndex} style={[styles.card, { marginBottom: 16 }]}>
              {/* Stock Header */}
              <View style={styles.stockHeader}>
                <View>
                  <Text style={styles.symbolText}>{stock.symbol}</Text>
                  <Text style={styles.stockSubtitle}>
                    {stock.total_signals} signals • Avg 7d: {stock.avg_profit_7d ? `${stock.avg_profit_7d.toFixed(2)}%` : 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Signals List */}
              {stock.signals && stock.signals.map((signal, signalIndex) => {
                const signalColor = getSignalColor(signal.signal_type);
                const todayProfit = signal.today ? signal.today.profit_pct : null;

                return (
                  <View key={signalIndex}>
                    <View style={styles.divider} />
                    <TouchableOpacity
                      style={styles.signalRow}
                      onPress={() => navigation.navigate('SignalDetail', { signal, symbol: stock.symbol })}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={styles.signalInfo}>
                          <Text style={[styles.signalTypeBadge, { color: signalColor }]}>
                            {signal.signal_type}
                          </Text>
                          <Text style={styles.signalDate}>
                            {new Date(signal.signal_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </View>
                        <Text style={styles.signalPrice}>${signal.signal_price.toFixed(2)}</Text>
                      </View>
                      {todayProfit !== null && (
                        <View style={styles.profitContainer}>
                          <Text style={[styles.profitValue, todayProfit >= 0 ? styles.profit : styles.loss]}>
                            {todayProfit >= 0 ? '+' : ''}{todayProfit.toFixed(2)}%
                          </Text>
                          {signal.today && (
                            <Text style={styles.currentPrice}>${signal.today.price.toFixed(2)}</Text>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
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
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  stockHeader: {
    marginBottom: 8,
  },
  symbolText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  stockSubtitle: {
    fontSize: 12,
    color: theme.textTertiary,
  },
  signalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  signalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  signalTypeBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  signalDate: {
    fontSize: 12,
    color: theme.textTertiary,
  },
  signalPrice: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  profitContainer: {
    alignItems: 'flex-end',
  },
  profitValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  profit: {
    color: theme.profit,
  },
  loss: {
    color: theme.loss,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  strategyText: {
    fontSize: 12,
    color: theme.textTertiary,
    marginTop: 4,
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
});
