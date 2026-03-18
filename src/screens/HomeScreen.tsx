// ==========================================
// Home Screen — Warm editorial magazine layout
// ==========================================

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { LANGUAGES, LEVELS, TOPIC_ICONS, SAMPLE_STORIES } from '../data/constants';
import { Story } from '../types';
import { getStories } from '../services/firestore';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 600, useNativeDriver: true,
    }).start();
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const fetched = await getStories(
        userProfile?.targetLanguage || 'de',
        userProfile?.level || 'A1'
      );
      
      // Fallback to sample stories if Firestore is empty
      if (fetched.length === 0) {
        const fallback = SAMPLE_STORIES.filter(
          s => s.language === (userProfile?.targetLanguage || 'de') && s.level === (userProfile?.level || 'A1')
        );
        setStories(fallback.length > 0 ? fallback : SAMPLE_STORIES.slice(0, 4));
      } else {
        setStories(fetched);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      setStories(SAMPLE_STORIES.slice(0, 4)); // Emergency fallback
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStories();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const langObj = LANGUAGES.find((l) => l.code === userProfile?.targetLanguage);
  const levelObj = LEVELS.find((l) => l.code === userProfile?.level) || LEVELS[0];
  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';

  const dailyWord = {
    word: 'Wanderlust',
    translation: 'A deep desire to travel and explore',
    partOfSpeech: 'noun',
  };

  return (
    <View style={styles.container}>
      <View style={styles.ambient} />

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* ---- HEADER ---- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>Good {greeting},</Text>
            <Text style={styles.nameText}>{userProfile?.name || 'Learner'}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.streakPill}>
              <Text style={styles.streakLabel}>STREAK</Text>
              <Text style={styles.streakNum}>{userProfile?.streak || 0}</Text>
            </View>
          </View>
        </View>

        {/* ---- LANGUAGE / LEVEL CHIPS ---- */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {langObj?.name || 'German'}
            </Text>
          </View>
          <View style={[styles.chip, { borderColor: levelObj.color + '40' }]}>
            <View style={[styles.chipDot, { backgroundColor: levelObj.color }]} />
            <Text style={[styles.chipText, { color: levelObj.color }]}>
              {levelObj.code}
            </Text>
          </View>
        </View>

        {/* ---- CONTINUE READING ---- */}
        {stories.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>CONTINUE READING</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('StoryReader', { storyId: stories[0].id })}
              style={styles.continueCard}
            >
              <View style={styles.continueIconBox}>
                <Ionicons name="book-outline" size={24} color={Colors.primary} />
              </View>
              <View style={styles.continueRight}>
                <Text style={styles.continueTitle}>{stories[0].title}</Text>
                <Text style={styles.continueMeta}>
                  {stories[0].estimatedReadTime} min · {stories[0].level} · {stories[0].topic}
                </Text>
                <View style={styles.continueProgress}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '35%' }]} />
                  </View>
                  <Text style={styles.progressPct}>35%</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </>
        )}

        {/* ---- WORD OF THE DAY ---- */}
        <Text style={styles.sectionLabel}>WORD OF THE DAY</Text>
        <View style={styles.wordCard}>
          <View style={styles.wordAccent} />
          <View style={styles.wordContent}>
            <View style={styles.wordTopRow}>
              <Text style={styles.wordPartOfSpeech}>{dailyWord.partOfSpeech}</Text>
            </View>
            <Text style={styles.wordText}>{dailyWord.word}</Text>
            <Text style={styles.wordTranslation}>{dailyWord.translation}</Text>
          </View>
        </View>

        {/* ---- STORIES FOR YOU ---- */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>STORIES FOR YOU</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Library')}>
            <Text style={styles.seeAllText}>See all →</Text>
          </TouchableOpacity>
        </View>

        {stories.map((story, index) => (
          <TouchableOpacity
            key={story.id}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('StoryReader', { storyId: story.id })}
            style={styles.storyListItem}
          >
            <View style={styles.storyListLeft}>
              <View style={[styles.storyIndex, index === 0 && { backgroundColor: Colors.primaryMuted }]}>
                <Text style={[styles.storyIndexText, index === 0 && { color: Colors.primary }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.storyListInfo}>
                <Text style={styles.storyListTitle}>{story.title}</Text>
                <View style={styles.storyListMeta}>
                  <Text style={styles.storyListMetaText}>
                    {story.topic}
                  </Text>
                  <Text style={styles.storyListDot}>·</Text>
                  <Text style={styles.storyListMetaText}>{story.estimatedReadTime} min</Text>
                  <Text style={styles.storyListDot}>·</Text>
                  <Text style={styles.storyListMetaText}>{story.wordCount} words</Text>
                </View>
              </View>
            </View>
            <View style={[styles.storyLevelPill, { backgroundColor: (LEVELS.find(l => l.code === story.level)?.color || Colors.teal) + '20' }]}>
              <Text style={[styles.storyLevelText, { color: LEVELS.find(l => l.code === story.level)?.color || Colors.teal }]}>
                {story.level}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  ambient: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.primaryMuted, top: -100, right: -80,
  },
  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl, paddingTop: 64, paddingBottom: Spacing.md,
  },
  headerLeft: {},
  greetingText: { fontSize: FontSizes.md, color: Colors.textMuted, marginBottom: 2 },
  nameText: { fontSize: FontSizes.xxl, fontWeight: '300', color: Colors.textPrimary },
  headerRight: {},
  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(67, 97, 238, 0.15)',
  },
  streakLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  streakNum: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.primary },
  // Chips
  chipRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  chipText: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.textSecondary },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  // Section
  sectionLabel: {
    fontSize: FontSizes.xs, color: Colors.textMuted, letterSpacing: 3,
    fontWeight: '700', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingRight: Spacing.xl,
  },
  seeAllText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600' },
  // Continue Card
  continueCard: {
    marginHorizontal: Spacing.xl, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md + 4, borderWidth: 1, borderColor: Colors.border,
    ...Shadows.soft,
  },
  continueIconBox: {
    width: 56, height: 56, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  continueRight: { flex: 1 },
  continueTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  continueMeta: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 8, textTransform: 'capitalize' },
  continueProgress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressTrack: { flex: 1, height: 3, backgroundColor: Colors.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  progressPct: { fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600' },
  // Word Card
  wordCard: {
    marginHorizontal: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', ...Shadows.soft,
  },
  wordAccent: { width: 4, backgroundColor: Colors.primary },
  wordContent: { flex: 1, padding: Spacing.lg },
  wordTopRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  wordPartOfSpeech: {
    fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  wordText: { fontSize: FontSizes.xxl, fontWeight: '300', color: Colors.textPrimary, marginBottom: 6 },
  wordTranslation: { fontSize: FontSizes.md, color: Colors.textMuted, fontStyle: 'italic' },
  // Story list items
  storyListItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.xl, paddingVertical: Spacing.md + 4,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  storyListLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  storyIndex: {
    width: 40, height: 40, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  storyIndexText: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textMuted },
  storyListInfo: { flex: 1 },
  storyListTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  storyListMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  storyListMetaText: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'capitalize' },
  storyListDot: { color: Colors.textMuted, fontSize: FontSizes.xs },
  storyLevelPill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  storyLevelText: { fontSize: FontSizes.xs, fontWeight: '700' },
});

export default HomeScreen;
