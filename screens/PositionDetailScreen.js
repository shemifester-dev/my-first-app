import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PositionDetailScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { position } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.symbolText}>{position.symbol}</Text>
        <Text style={styles.strategyText}>{position.strategy}</Text>
      </View>

      {/* P&L Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Profit/Loss %</Text>
            <Text style={[styles.statValue, position.profit_pct >= 0 ? styles.profitText : styles.lossText]}>
              {position.profit_pct >= 0 ? '+' : ''}{position.profit_pct.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Profit/Loss $</Text>
            <Text style={[styles.statValue, position.profit_dollars >= 0 ? styles.profitText : styles.lossText]}>
              ${position.profit_dollars >= 0 ? '+' : ''}{position.profit_dollars.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Days Held</Text>
            <Text style={styles.statValue}>{position.days_held} days</Text>
          </View>
        </View>
      </View>

      {/* Price Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Entry Price</Text>
            <Text style={styles.statValue}>${position.entry_price.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Price</Text>
            <Text style={styles.statValue}>${position.current_price.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text style={styles.statValue}>{position.quantity}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Value</Text>
            <Text style={styles.statValue}>
              ${(position.current_price * position.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Stop Loss Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stop Loss</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Stop</Text>
            <Text style={styles.statValue}>${position.current_stop.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Initial Stop</Text>
            <Text style={styles.statValue}>${position.initial_stop.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Distance to Stop</Text>
            <Text style={styles.statValue}>
              {((position.current_price - position.current_stop) / position.current_price * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Info</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Entry Date</Text>
            <Text style={styles.statValue}>
              {new Date(position.entry_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>50% Profit Taken</Text>
            <Text style={[styles.statValue, position.profit_taken_50pct ? styles.profitText : styles.neutralText]}>
              {position.profit_taken_50pct ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
      </View>
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
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  strategyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
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
  neutralText: {
    color: '#94a3b8',
  },
});
