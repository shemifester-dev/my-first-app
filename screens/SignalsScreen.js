import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';

const API_URL = 'http://192.168.1.253:5000';

export default function SignalsScreen() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);
      setError(null);

      const signalsResponse = await fetch(`${API_URL}/api/signals_by_stock`);
      if (!signalsResponse.ok) throw new Error('Signals API failed');
      const signalsData = await signalsResponse.json();

      // Get all signals across all stocks
      const allSignals = [];
      if (Array.isArray(signalsData)) {
        signalsData.forEach(stock => {
          if (stock.signals && Array.isArray(stock.signals)) {
            stock.signals.forEach(signal => {
              allSignals.push({
                ...signal,
                symbol: stock.symbol,
                timestamp: signal.signal_date || signal.timestamp
              });
            });
          }
        });
      }

      // Sort by timestamp (newest first)
      allSignals.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });

      setSignals(allSignals);
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
      return '#10b981';
    }
    return '#ef4444';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Signals</Text>
        <Text style={styles.headerSubtitle}>{signals.length} signals tracked</Text>
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
          {signals.map((signal, index) => {
            const signalColor = getSignalColor(signal.signal_type);
            const todayProfit = signal.today ? signal.today.profit_pct : null;

            return (
              <View key={index} style={[styles.card, { marginBottom: 12 }]}>
                <View style={styles.signalHeader}>
                  <View>
                    <Text style={styles.symbolText}>{signal.symbol}</Text>
                    <Text style={styles.dateText}>
                      {new Date(signal.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={styles.signalBadgeContainer}>
                    <Text style={[styles.signalBadge, { color: signalColor, borderColor: signalColor }]}>
                      {signal.signal_type}
                    </Text>
                    {todayProfit !== null && (
                      <Text style={[styles.profitText, todayProfit >= 0 ? styles.profit : styles.loss]}>
                        {todayProfit >= 0 ? '+' : ''}{todayProfit.toFixed(2)}%
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Signal Price</Text>
                    <Text style={styles.detailValue}>${signal.signal_price.toFixed(2)}</Text>
                  </View>
                  {signal.today && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Current Price</Text>
                      <Text style={styles.detailValue}>${signal.today.price.toFixed(2)}</Text>
                    </View>
                  )}
                </View>

                {signal.strategy_version && (
                  <Text style={styles.strategyText}>Strategy: {signal.strategy_version}</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  symbolText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
  },
  signalBadgeContainer: {
    alignItems: 'flex-end',
  },
  signalBadge: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 6,
  },
  profitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  profit: {
    color: '#10b981',
  },
  loss: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
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
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  strategyText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 4,
  },
});
