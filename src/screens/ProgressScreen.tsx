// ==========================================
// Progress Screen — Reading stats + activity chart
// ==========================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeklyData = [3, 5, 2, 4, 1, 6, 2]; // stories read

const ProgressScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const maxVal = Math.max(...weeklyData, 1);

  return (
    <View style={styles.container}>
      <View style={styles.ambient} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSmall}>YOUR JOURNEY</Text>
          <Text style={styles.headerTitle}>Progress</Text>
        </View>

        {/* Streak card */}
        <View style={styles.streakCard}>
          <View style={styles.streakCardAccent} />
          <View style={styles.streakCardContent}>
            <View style={styles.streakRow}>
              <Text style={styles.streakFire}>🔥</Text>
              <View>
                <Text style={styles.streakLabel}>Reading Streak</Text>
                <View style={styles.streakValues}>
                  <View style={styles.streakCol}>
                    <Text style={styles.streakNumber}>{userProfile?.streak || 0}</Text>
                    <Text style={styles.streakUnit}>current</Text>
                  </View>
                  <View style={styles.streakDivider} />
                  <View style={styles.streakCol}>
                    <Text style={styles.streakNumber}>{Math.max(userProfile?.streak || 0, 3)}</Text>
                    <Text style={styles.streakUnit}>best</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="book" size={22} color={Colors.teal} />
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Stories Read</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="bookmark" size={22} color={Colors.primary} />
            <Text style={styles.statNumber}>28</Text>
            <Text style={styles.statLabel}>Words Saved</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="time" size={22} color={Colors.accent} />
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Min. Reading</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="ribbon" size={22} color={Colors.info} />
            <Text style={styles.statNumber}>{userProfile?.level || 'A1'}</Text>
            <Text style={styles.statLabel}>Current Level</Text>
          </View>
        </View>

        {/* Weekly activity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WEEKLY ACTIVITY</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartRow}>
              {weeklyData.map((val, i) => (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${(val / maxVal) * 100}%`,
                          backgroundColor: i === new Date().getDay() - 1 ? Colors.primary : Colors.surfaceLight,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[
                    styles.dayLabel,
                    i === new Date().getDay() - 1 && { color: Colors.primary },
                  ]}>
                    {daysOfWeek[i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Reading tracker heatmap-like */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>READING TRACKER · 2026</Text>
          <View style={styles.heatmapCard}>
            <View style={styles.heatmapGrid}>
              {Array.from({ length: 28 }, (_, i) => {
                const active = [0, 5, 6, 12, 13, 14, 19, 20].includes(i);
                return (
                  <View
                    key={i}
                    style={[
                      styles.heatmapCell,
                      active && styles.heatmapCellActive,
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.heatmapLegend}>
              <Text style={styles.heatmapLegendText}>Less</Text>
              <View style={[styles.heatmapCell, styles.heatmapCellSmall]} />
              <View style={[styles.heatmapCell, styles.heatmapCellSmall, styles.heatmapCellActive]} />
              <Text style={styles.heatmapLegendText}>More</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  ambient: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.primaryMuted, bottom: 50, left: -100,
  },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 64, paddingBottom: Spacing.md },
  headerSmall: {
    fontSize: FontSizes.xs, color: Colors.teal, letterSpacing: 3,
    fontWeight: '700', marginBottom: Spacing.xs,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '300', color: Colors.textPrimary },
  // Streak card
  streakCard: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg, flexDirection: 'row',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, ...Shadows.soft,
  },
  streakCardAccent: { width: 4, backgroundColor: Colors.primary },
  streakCardContent: { flex: 1, padding: Spacing.lg },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  streakFire: { fontSize: 40 },
  streakLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '600', marginBottom: Spacing.sm },
  streakValues: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  streakCol: { alignItems: 'center' },
  streakNumber: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary },
  streakUnit: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  streakDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  // Stats grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl, marginTop: Spacing.lg, gap: Spacing.sm,
  },
  statBox: {
    width: (width - Spacing.xl * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.soft,
  },
  statNumber: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary, marginVertical: 6 },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: '500' },
  // Section
  section: { marginTop: Spacing.xl },
  sectionLabel: {
    fontSize: FontSizes.xs, color: Colors.textMuted, letterSpacing: 3,
    fontWeight: '700', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md,
  },
  // Chart
  chartCard: {
    marginHorizontal: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg, ...Shadows.soft,
  },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  chartCol: { alignItems: 'center', flex: 1 },
  barBg: {
    width: 20, height: 100, backgroundColor: Colors.glass,
    borderRadius: 10, justifyContent: 'flex-end', overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 10 },
  dayLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 6, fontWeight: '500' },
  // Heatmap
  heatmapCard: {
    marginHorizontal: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg, ...Shadows.soft,
  },
  heatmapGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
  },
  heatmapCell: {
    width: (width - Spacing.xl * 2 - Spacing.lg * 2 - 6 * 6) / 7,
    aspectRatio: 1, borderRadius: 4, backgroundColor: Colors.glass,
  },
  heatmapCellActive: { backgroundColor: Colors.teal + '60' },
  heatmapCellSmall: { width: 14, height: 14 },
  heatmapLegend: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 6, marginTop: Spacing.md,
  },
  heatmapLegendText: { fontSize: FontSizes.xs, color: Colors.textMuted },
});

export default ProgressScreen;
