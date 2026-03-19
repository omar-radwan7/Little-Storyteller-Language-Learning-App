// ==========================================
// Profile Screen — User info, settings, sign out
// Warm parchment with mossy accents
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
  const { userProfile, firebaseUser, updateProfile } = useAuth();
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

  const handleUpdateLanguage = () => {
    navigation.navigate('PreferencePicker', { type: 'language' });
  };

  const handleUpdateLevel = () => {
    navigation.navigate('PreferencePicker', { type: 'level' });
  };

  const handleUpdateDailyGoal = () => {
    navigation.navigate('PreferencePicker', { type: 'dailyGoal' });
  };

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
      onPress: handleUpdateLanguage,
    },
    {
      icon: 'bar-chart-outline' as const,
      label: 'Current Level',
      value: `${levelObj?.code || 'A1'} — ${levelObj?.name || 'Beginner'}`,
      color: Colors.teal,
      onPress: handleUpdateLevel,
    },
    {
      icon: 'flame-outline' as const,
      label: 'Daily Goal',
      value: `${goalObj?.count || 1} ${goalObj?.count === 1 ? 'story' : 'stories'}/day`,
      color: Colors.accent,
      onPress: handleUpdateDailyGoal,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
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

        {/* Quick stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={[styles.quickNum, { color: Colors.accent }]}>{userProfile?.streak || 0}</Text>
            <Text style={styles.quickLabel}>Day Streak</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickNum, { color: Colors.primary }]}>{stats.stories}</Text>
            <Text style={styles.quickLabel}>Stories</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickNum, { color: Colors.teal }]}>{stats.words}</Text>
            <Text style={styles.quickLabel}>Words</Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Learning Preferences</Text>
        {settingRows.map((row, i) => (
          <TouchableOpacity key={i} style={styles.settingRow} activeOpacity={0.7} onPress={row.onPress}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: row.color + '12' }]}>
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

        {/* Sign out */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.rose} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Lingua v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 52, paddingBottom: 8 },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary },

  userCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.xl, marginTop: 8,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textInverse },
  userInfo: { flex: 1 },
  userName: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 1 },
  userEmail: { fontSize: FontSizes.xs, color: Colors.textMuted },

  quickStats: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    marginHorizontal: Spacing.xl, marginTop: 8,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 12, paddingHorizontal: 14,
  },
  quickStat: { alignItems: 'center' },
  quickNum: { fontSize: FontSizes.xl, fontWeight: '800', marginBottom: 1 },
  quickLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  quickDivider: { width: 1, height: 26, backgroundColor: Colors.borderLight },

  sectionTitle: {
    fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl, marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.xl, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 1 },
  settingValue: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textPrimary },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    paddingVertical: 12, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.rose + '30',
    backgroundColor: Colors.roseMuted,
  },
  signOutText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.rose },
  version: {
    textAlign: 'center', fontSize: 10, color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});

export default ProfileScreen;
