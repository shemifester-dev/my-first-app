import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

export default function SignalDetailScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { signal, symbol } = route.params;

  const getSignalColor = (signalType) => {
    if (signalType === 'BUY' || signalType === 'BREAKOUT') {
      return theme.profit;
    }
    return theme.loss;
  };

  const signalColor = getSignalColor(signal.signal_type);
  const styles = getStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.symbolText}>{symbol}</Text>
        <Text style={[styles.signalTypeBadge, { color: signalColor, borderColor: signalColor }]}>
          {signal.signal_type}
        </Text>
      </View>

      {/* Signal Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Signal Information</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Signal Date</Text>
            <Text style={styles.statValue}>
              {new Date(signal.signal_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Signal Price</Text>
            <Text style={styles.statValue}>${signal.signal_price.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Strategy</Text>
            <Text style={styles.statValue}>{signal.strategy || 'N/A'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Strategy Version</Text>
            <Text style={styles.statValue}>{signal.strategy_version || 'N/A'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={styles.statValue}>{signal.status || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Today's Performance */}
      {signal.today && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current Price</Text>
              <Text style={styles.statValue}>${signal.today.price.toFixed(2)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Profit/Loss</Text>
              <Text style={[styles.statValue, signal.today.profit_pct >= 0 ? styles.profitText : styles.lossText]}>
                {signal.today.profit_pct >= 0 ? '+' : ''}{signal.today.profit_pct.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Historical Outcomes */}
      {signal.outcomes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historical Outcomes</Text>
          <View style={styles.card}>
            {signal.outcomes['1_day'] && (
              <View style={styles.outcomeRow}>
                <Text style={styles.outcomeLabel}>1 Day</Text>
                <Text style={styles.outcomeValue}>${signal.outcomes['1_day'].price.toFixed(2)}</Text>
                <Text style={[styles.outcomeProfit, signal.outcomes['1_day'].profit_pct >= 0 ? styles.profitText : styles.lossText]}>
                  {signal.outcomes['1_day'].profit_pct >= 0 ? '+' : ''}{signal.outcomes['1_day'].profit_pct.toFixed(2)}%
                </Text>
              </View>
            )}
            {signal.outcomes['3_day'] && (
              <View style={styles.outcomeRow}>
                <Text style={styles.outcomeLabel}>3 Day</Text>
                <Text style={styles.outcomeValue}>${signal.outcomes['3_day'].price.toFixed(2)}</Text>
                <Text style={[styles.outcomeProfit, signal.outcomes['3_day'].profit_pct >= 0 ? styles.profitText : styles.lossText]}>
                  {signal.outcomes['3_day'].profit_pct >= 0 ? '+' : ''}{signal.outcomes['3_day'].profit_pct.toFixed(2)}%
                </Text>
              </View>
            )}
            {signal.outcomes['7_day'] && (
              <View style={styles.outcomeRow}>
                <Text style={styles.outcomeLabel}>7 Day</Text>
                <Text style={styles.outcomeValue}>${signal.outcomes['7_day'].price.toFixed(2)}</Text>
                <Text style={[styles.outcomeProfit, signal.outcomes['7_day'].profit_pct >= 0 ? styles.profitText : styles.lossText]}>
                  {signal.outcomes['7_day'].profit_pct >= 0 ? '+' : ''}{signal.outcomes['7_day'].profit_pct.toFixed(2)}%
                </Text>
              </View>
            )}
            {signal.outcomes['14_day'] && (
              <View style={styles.outcomeRow}>
                <Text style={styles.outcomeLabel}>14 Day</Text>
                <Text style={styles.outcomeValue}>${signal.outcomes['14_day'].price.toFixed(2)}</Text>
                <Text style={[styles.outcomeProfit, signal.outcomes['14_day'].profit_pct >= 0 ? styles.profitText : styles.lossText]}>
                  {signal.outcomes['14_day'].profit_pct >= 0 ? '+' : ''}{signal.outcomes['14_day'].profit_pct.toFixed(2)}%
                </Text>
              </View>
            )}
            {signal.outcomes['30_day'] && (
              <View style={styles.outcomeRow}>
                <Text style={styles.outcomeLabel}>30 Day</Text>
                <Text style={styles.outcomeValue}>${signal.outcomes['30_day'].price.toFixed(2)}</Text>
                <Text style={[styles.outcomeProfit, signal.outcomes['30_day'].profit_pct >= 0 ? styles.profitText : styles.lossText]}>
                  {signal.outcomes['30_day'].profit_pct >= 0 ? '+' : ''}{signal.outcomes['30_day'].profit_pct.toFixed(2)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Indicators */}
      {signal.indicators && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicators</Text>
          <View style={styles.card}>
            {Object.entries(signal.indicators).map(([key, value], index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>{key.replace(/_/g, ' ')}</Text>
                <Text style={styles.statValue}>
                  {typeof value === 'number' ? value.toFixed(2) : String(value)}
                </Text>
              </View>
            ))}
          </View>
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
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  signalTypeBadge: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  statLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
    textTransform: 'capitalize',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    textAlign: 'right',
  },
  outcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  outcomeLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
  },
  outcomeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    textAlign: 'center',
  },
  outcomeProfit: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  profitText: {
    color: theme.profit,
  },
  lossText: {
    color: theme.loss,
  },
});
