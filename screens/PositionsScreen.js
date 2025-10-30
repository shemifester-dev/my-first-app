import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

const API_URL = 'http://192.168.1.253:5000';

export default function PositionsScreen() {
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
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Open Positions</Text>
        <Text style={styles.headerSubtitle}>{positions.length} active positions</Text>
      </View>

      {loading && (
        <View style={styles.section}>
          <Text style={styles.emptyText}>Loading positions...</Text>
        </View>
      )}

      {error && (
        <View style={styles.section}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      )}

      {!loading && !error && positions.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.emptyText}>No open positions</Text>
          <Text style={styles.emptySubtext}>Your positions will appear here</Text>
        </View>
      )}

      {!loading && !error && positions.length > 0 && (
        <View style={styles.section}>
          {positions.map((position, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { marginBottom: 12 }]}
              activeOpacity={0.7}
            >
              <View style={styles.positionHeader}>
                <View>
                  <Text style={styles.symbolText}>{position.symbol}</Text>
                  <Text style={styles.strategyText}>{position.strategy}</Text>
                </View>
                <Text style={[styles.profitBadge, position.profit_pct >= 0 ? styles.profitBg : styles.lossBg]}>
                  {position.profit_pct >= 0 ? '+' : ''}{position.profit_pct.toFixed(2)}%
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Entry Price</Text>
                  <Text style={styles.detailValue}>${position.entry_price.toFixed(2)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Current Price</Text>
                  <Text style={styles.detailValue}>${position.current_price.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>{position.quantity}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>P&L</Text>
                  <Text style={[styles.detailValue, position.profit_dollars >= 0 ? styles.profitText : styles.lossText]}>
                    ${position.profit_dollars >= 0 ? '+' : ''}{position.profit_dollars.toFixed(0)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Stop Loss</Text>
                  <Text style={styles.detailValue}>${position.current_stop.toFixed(2)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Days Held</Text>
                  <Text style={styles.detailValue}>{position.days_held} days</Text>
                </View>
              </View>
            </TouchableOpacity>
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
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symbolText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  strategyText: {
    fontSize: 12,
    color: '#64748b',
  },
  profitBadge: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  profitBg: {
    backgroundColor: '#10b98120',
    color: '#10b981',
  },
  lossBg: {
    backgroundColor: '#ef444420',
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
});
