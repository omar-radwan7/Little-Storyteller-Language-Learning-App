// ==========================================
// Progress Screen — Reading stats + activity chart
// Warm nature palette with mossy accents
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
const weeklyData = [3, 5, 2, 4, 1, 6, 2];

const ProgressScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const maxVal = Math.max(...weeklyData, 1);
  const todayIndex = (new Date().getDay() + 6) % 7; // Mon=0

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSub}>your learning journey</Text>
        </View>

        {/* Streak card */}
        <View style={styles.streakCard}>
          <View style={styles.streakTop}>
            <Text style={styles.streakFire}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>Reading Streak</Text>
              <Text style={styles.streakSub}>Keep it going!</Text>
            </View>
          </View>
          <View style={styles.streakStats}>
            <View style={styles.streakCol}>
              <Text style={[styles.streakNum, { color: Colors.accent }]}>{userProfile?.streak || 0}</Text>
              <Text style={styles.streakUnit}>current</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakCol}>
              <Text style={[styles.streakNum, { color: Colors.primary }]}>{Math.max(userProfile?.streak || 0, 3)}</Text>
              <Text style={styles.streakUnit}>best</Text>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'book' as const, num: '4', label: 'Stories Read', color: Colors.primary },
            { icon: 'bookmark' as const, num: '28', label: 'Words Saved', color: Colors.accent },
            { icon: 'time' as const, num: '42', label: 'Min. Reading', color: Colors.teal },
            { icon: 'ribbon' as const, num: userProfile?.level || 'A1', label: 'Current Level', color: Colors.lavender },
          ].map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '12' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statNum, { color: stat.color }]}>{stat.num}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly activity */}
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
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
                        backgroundColor: i === todayIndex ? Colors.primary : Colors.primaryMuted,
                      },
                    ]}
                  />
                </View>
                <Text style={[
                  styles.dayLabel,
                  i === todayIndex && { color: Colors.primary, fontWeight: '700' },
                ]}>
                  {daysOfWeek[i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reading tracker heatmap */}
        <Text style={styles.sectionTitle}>Reading Tracker · 2026</Text>
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
            <Text style={styles.legendText}>Less</Text>
            <View style={styles.heatmapCell} />
            <View style={[styles.heatmapCell, styles.heatmapCellActive]} />
            <Text style={styles.legendText}>More</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 52, paddingBottom: 4 },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },

  // Streak
  streakCard: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  streakTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  streakFire: { fontSize: 28 },
  streakTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  streakSub: { fontSize: FontSizes.xs, color: Colors.textMuted },
  streakStats: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  streakCol: { alignItems: 'center' },
  streakNum: { fontSize: FontSizes.xl, fontWeight: '800' },
  streakUnit: { fontSize: 9, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 1 },
  streakDivider: { width: 1, height: 26, backgroundColor: Colors.borderLight },

  // Stats grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl, marginTop: Spacing.md, gap: 6,
  },
  statBox: {
    width: (width - Spacing.xl * 2 - 6) / 2,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: 12, borderWidth: 1, borderColor: Colors.border,
  },
  statIconBox: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  statNum: { fontSize: FontSizes.xl, fontWeight: '800', marginBottom: 1 },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  // Section
  sectionTitle: {
    fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl, marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },

  // Chart
  chartCard: {
    marginHorizontal: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    padding: 14,
  },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  chartCol: { alignItems: 'center', flex: 1 },
  barBg: {
    width: 14, height: 72, backgroundColor: Colors.surfaceLight,
    borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 7 },
  dayLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 5, fontWeight: '500' },

  // Heatmap
  heatmapCard: {
    marginHorizontal: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    padding: 14,
  },
  heatmapGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 5,
  },
  heatmapCell: {
    width: (width - Spacing.xl * 2 - 14 * 2 - 5 * 6) / 7,
    aspectRatio: 1, borderRadius: 4, backgroundColor: Colors.surfaceLight,
  },
  heatmapCellActive: { backgroundColor: Colors.primary + '40' },
  heatmapLegend: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 5, marginTop: Spacing.sm,
  },
  legendText: { fontSize: 10, color: Colors.textMuted },
});

export default ProgressScreen;
