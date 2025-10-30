import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

const API_URL = 'http://192.168.1.253:5000';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [positions, setPositions] = useState([]);
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

      const summaryResponse = await fetch(`${API_URL}/api/portfolio_summary`);
      if (!summaryResponse.ok) throw new Error('Portfolio API failed');
      const summaryData = await summaryResponse.json();
      setPortfolioSummary(summaryData);

      const positionsResponse = await fetch(`${API_URL}/api/positions`);
      if (!positionsResponse.ok) throw new Error('Positions API failed');
      const positionsData = await positionsResponse.json();
      setPositions(positionsData);

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Dashboard</Text>
        <Text style={styles.headerSubtitle}>Dad's Bollinger Strategy v3.24</Text>
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
              <Text style={styles.statLabel}>Open Positions</Text>
              <Text style={styles.statValue}>{portfolioSummary.position_count}</Text>
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

      {/* Recent Positions Preview */}
      {!loading && !error && positions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Positions (Top 3)</Text>
          {positions.slice(0, 3).map((position, index) => (
            <View key={index} style={[styles.card, { marginBottom: 12 }]}>
              <View style={styles.positionHeader}>
                <Text style={styles.symbolText}>{position.symbol}</Text>
                <Text style={[styles.profitBadge, position.profit_pct >= 0 ? styles.profitBg : styles.lossBg]}>
                  {position.profit_pct >= 0 ? '+' : ''}{position.profit_pct.toFixed(2)}%
                </Text>
              </View>
              <View style={styles.positionDetails}>
                <Text style={styles.detailText}>Entry: ${position.entry_price.toFixed(2)}</Text>
                <Text style={styles.detailText}>Current: ${position.current_price.toFixed(2)}</Text>
              </View>
              <View style={styles.positionDetails}>
                <Text style={styles.detailText}>Qty: {position.quantity}</Text>
                <Text style={[styles.detailText, position.profit_dollars >= 0 ? styles.profitText : styles.lossText]}>
                  ${position.profit_dollars >= 0 ? '+' : ''}{position.profit_dollars.toFixed(0)}
                </Text>
              </View>
            </View>
          ))}
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
    paddingTop: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  profitText: {
    color: '#10b981',
  },
  lossText: {
    color: '#ef4444',
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
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profitBadge: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  profitBg: {
    backgroundColor: '#10b98120',
    color: '#10b981',
  },
  lossBg: {
    backgroundColor: '#ef444420',
    color: '#ef4444',
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
