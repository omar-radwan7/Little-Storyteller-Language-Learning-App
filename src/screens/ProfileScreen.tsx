// ==========================================
// Profile Screen — User info, settings, sign out
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { signOutUser } from '../services/auth';
import { LANGUAGES, LEVELS, DAILY_GOALS } from '../data/constants';
import { getSavedWords, getCompletedStories } from '../services/firestore';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { userProfile, firebaseUser } = useAuth();
  const [stats, setStats] = useState({ stories: 0, words: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (firebaseUser) {
        try {
          const words = await getSavedWords(firebaseUser.uid);
          const stories = await getCompletedStories(firebaseUser.uid);
          setStats({ stories: stories.length, words: words.length });
        } catch (err) {
          console.error('Error fetching stats:', err);
        }
      }
    };
    fetchStats();
  }, [firebaseUser]);

  const langObj = LANGUAGES.find((l) => l.code === userProfile?.targetLanguage);
  const levelObj = LEVELS.find((l) => l.code === userProfile?.level);
  const goalObj = DAILY_GOALS.find((g) => g.count === userProfile?.dailyGoal);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOutUser();
          } catch {
            Alert.alert('Error', 'Failed to sign out.');
          }
        },
      },
    ]);
  };

  const settingRows = [
    {
      icon: 'globe-outline' as const,
      label: 'Learning Language',
      value: `${langObj?.name || 'German'}`,
      color: Colors.primary,
    },
    {
      icon: 'bar-chart-outline' as const,
      label: 'Current Level',
      value: `${levelObj?.code || 'A1'} — ${levelObj?.name || 'Beginner'}`,
      color: Colors.teal,
    },
    {
      icon: 'flame-outline' as const,
      label: 'Daily Goal',
      value: `${goalObj?.count || 1} ${goalObj?.count === 1 ? 'story' : 'stories'}/day`,
      color: Colors.accent,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.ambient} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSmall}>ACCOUNT</Text>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User info card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userProfile?.name || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{userProfile?.email || ''}</Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionLabel}>LEARNING PREFERENCES</Text>
        {settingRows.map((row, i) => (
          <TouchableOpacity key={i} style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: row.color + '15' }]}>
                <Ionicons name={row.icon} size={18} color={row.color} />
              </View>
              <View>
                <Text style={styles.settingLabel}>{row.label}</Text>
                <Text style={styles.settingValue}>{row.value}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Quick stats */}
        <Text style={styles.sectionLabel}>QUICK STATS</Text>
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNum}>{userProfile?.streak || 0}</Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNum}>{stats.stories}</Text>
            <Text style={styles.quickStatLabel}>Stories</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNum}>{stats.words}</Text>
            <Text style={styles.quickStatLabel}>Words</Text>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.accent} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Lingua v1.0.0</Text>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  ambient: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: Colors.primaryMuted, top: -80, left: -80,
  },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 64, paddingBottom: Spacing.md },
  headerSmall: {
    fontSize: FontSizes.xs, color: Colors.primary, letterSpacing: 3,
    fontWeight: '700', marginBottom: Spacing.xs,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '300', color: Colors.textPrimary },
  userCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.soft,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  avatarText: { fontSize: FontSizes.xxl, fontWeight: '600', color: Colors.primary },
  userInfo: { flex: 1 },
  userName: { fontSize: FontSizes.xl, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  userEmail: { fontSize: FontSizes.sm, color: Colors.textMuted },
  sectionLabel: {
    fontSize: FontSizes.xs, color: Colors.textMuted, letterSpacing: 3,
    fontWeight: '700', paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl, marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 2 },
  settingValue: { fontSize: FontSizes.md, fontWeight: '500', color: Colors.textPrimary },
  quickStats: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    marginHorizontal: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg, ...Shadows.soft,
  },
  quickStat: { alignItems: 'center' },
  quickStatNum: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  quickStatLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  quickStatDivider: { width: 1, height: 36, backgroundColor: Colors.border },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, marginHorizontal: Spacing.xl, marginTop: Spacing.xl,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.accent + '30',
  },
  signOutText: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.accent },
  version: {
    textAlign: 'center', fontSize: FontSizes.xs, color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
});

export default ProfileScreen;
