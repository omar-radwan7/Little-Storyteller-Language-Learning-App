// ==========================================
// Home Screen  
// Inspired by Headway: split stats bar, solid  
// mission banner, horizontal story cards with
// colorful gradient backgrounds & large emojis
// ==========================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
  LayoutAnimation,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { LANGUAGES, LEVELS, TOPICS, TOPIC_IMAGES, SAMPLE_STORIES } from '../data/constants';
import { Story } from '../types';
import { getStories } from '../services/firestore';
import { getImageSource } from '../utils/imageHelper';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.52;

// Gradient-like colors for story cards
const CARD_PALETTES = [
  { bg: '#2B6652', text: '#FFFFFF', sub: 'rgba(255,255,255,0.7)' },
  { bg: '#E8963E', text: '#FFFFFF', sub: 'rgba(255,255,255,0.75)' },
  { bg: '#3AAFA9', text: '#FFFFFF', sub: 'rgba(255,255,255,0.7)' },
  { bg: '#8E7CC3', text: '#FFFFFF', sub: 'rgba(255,255,255,0.7)' },
  { bg: '#D96380', text: '#FFFFFF', sub: 'rgba(255,255,255,0.7)' },
];

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHomeTopic, setSelectedHomeTopic] = useState('daily life');
  const [grammarState, setGrammarState] = useState<number>(2); // Mock: 1 (new), 2 (progress), 3 (finished)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();
    loadStories();
  }, [userProfile?.targetLanguage, userProfile?.level]);

  const loadStories = async () => {
    try {
      const targetLang = userProfile?.targetLanguage || 'de';
      const currentLevel = userProfile?.level || 'A1';

      const levelMapping: Record<string, string[]> = {
        'A1': ['A1', 'A2'],
        'A2': ['A2', 'B1'],
        'B1': ['B1', 'B2'],
        'B2': ['B2'],
      };
      const allowedLevels = levelMapping[currentLevel] || ['A1'];

      const fetched = await getStories(targetLang, allowedLevels);
      
      if (fetched.length === 0) {
        // Fallback to sample data following the same rules
        const fallback = SAMPLE_STORIES.filter(
          s => s.language === targetLang && allowedLevels.includes(s.level)
        );
        setStories(fallback.slice(0, 5));
      } else {
        setStories(fetched);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      const errFallback = SAMPLE_STORIES.filter(s => 
        s.language === (userProfile?.targetLanguage || 'de') && 
        (userProfile?.level ? s.level === userProfile.level : s.level === 'A1')
      );
      setStories(errFallback.slice(0, 5));
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

  const { updateProfile } = useAuth();
  const handleUpdateLanguage = () => {
    navigation.navigate('PreferencePicker', { type: 'language' });
  };

  const handleMissionPress = () => {
    if (stories.length > 0) {
      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      navigation.navigate('StoryReader' as any, { storyId: randomStory.id });
    }
  };

  const handleCategoryPress = (topic: string) => {
    setSelectedHomeTopic(topic);
    // Subtle haptic when changing topic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const topicStories = useMemo(() => {
    return stories.filter(s => s.topic === selectedHomeTopic).slice(0, 4);
  }, [stories, selectedHomeTopic]);

  const dailyWord: any = null;

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* ---- HEADER with greeting ---- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {greeting}</Text>
            <Text style={styles.name}>{userProfile?.name || 'Learner'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Text style={styles.avatarLetter}>
              {(userProfile?.name || 'L')[0].toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---- STATS BAR (Headway split layout) ---- */}
        <View style={styles.statsBar}>
          {/* Left: Streak */}
          <View style={styles.statsStreak}>
            <Text style={styles.statsStreakLabel}>Streak</Text>
            <View style={styles.statsStreakRow}>
              <Text style={styles.streakFireEmoji}>🔥</Text>
              <Text style={styles.statsStreakNum}>{userProfile?.streak || 0}</Text>
            </View>
            <Text style={styles.statsStreakUnit}>
              {(userProfile?.streak || 0) === 1 ? 'day' : 'days'}
            </Text>
          </View>

          {/* Vertical divider */}
          <View style={styles.statsVertDivider} />

          {/* Right: Quick Stats */}
          <View style={styles.statsGrowth}>
            <Text style={styles.statsGrowthTitle}>Your Progress</Text>
            <View style={styles.statsMetrics}>
              <View style={styles.metric}>
                <Text style={[styles.metricNum, { color: Colors.primary }]}>{stories.length}</Text>
                <Text style={styles.metricLabel}>available</Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricNum, { color: Colors.accent }]}>{userProfile?.streak || 0}</Text>
                <Text style={styles.metricLabel}>streak</Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricNum, { color: Colors.teal }]}>{userProfile?.level || 'A1'}</Text>
                <Text style={styles.metricLabel}>level</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ---- DAILY MISSION BANNER (Headway-style solid color CTA) ---- */}
        <TouchableOpacity 
          style={styles.missionBanner} 
          activeOpacity={0.85}
          onPress={handleMissionPress}
        >
          <View style={styles.missionLeft}>
            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            <Text style={styles.missionText}>YOUR DAILY MISSION</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* ---- GRAMMAR CARD ---- */}
        {(() => {
          const langName = langObj?.name || 'German';
          const lvlCode = userProfile?.level || 'A1';
          const progressData = userProfile?.grammarProgress;

          let title = 'Start your Journey';
          let subtitle = 'Learn grammar basics';
          let cta = 'Begin →';
          let progress = 0;
          let isNew = !progressData;

          if (!progressData) {
            title = `Start your ${langName} Journey`;
            subtitle = `Learn ${langName} grammar step by step`;
            cta = 'Begin →';
          } else {
            title = 'Continue your progress';
            subtitle = progressData.lastLessonTitle || 'Keep learning';
            cta = 'Continue →';
            
            // Calculate progress % based on total lessons (25 for A1)
            const total = 25; 
            const completed = progressData.completedLessons?.length || 0;
            progress = Math.round((completed / total) * 100);
            isNew = false;
          }

          return (
            <TouchableOpacity 
              style={styles.grammarCard} 
              activeOpacity={0.85}
              onPress={() => navigation.navigate('GrammarMap')}
            >
              <View style={styles.grammarCardTop}>
                <Text style={styles.grammarLabel}>Grammar</Text>
                <View style={styles.grammarBadge}>
                  <Text style={styles.grammarBadgeText}>{lvlCode} · {langName}</Text>
                </View>
              </View>

              <View style={styles.grammarTitleRow}>
                <Text style={styles.grammarTitle}>{title}</Text>
                {isNew && (
                  <View style={styles.grammarNewBadge}>
                    <Text style={styles.grammarNewBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.grammarSubtitle}>{subtitle}</Text>
              
              <View style={styles.grammarCardBottom}>
                {!isNew ? (
                  <View style={styles.grammarProgressRail}>
                    <View style={[styles.grammarProgressFill, { width: `${progress}%` }]} />
                  </View>
                ) : (
                  <View style={{ flex: 1 }} />
                )}
                <Text style={styles.grammarCta}>{cta}</Text>
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* ---- HORIZONTAL STORY CARDS (MasterClass-inspired large visual cards) ---- */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>To get you started</Text>
            <Text style={styles.sectionSub}>Stories picked for your level</Text>
          </View>
          <View style={styles.sectionActions}>
            <TouchableOpacity onPress={handleUpdateLanguage} style={styles.actionBtn}>
              <Text style={styles.actionText}>{langObj?.flag || '🌐'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
          decelerationRate="fast"
          snapToInterval={CARD_W + 14}
        >
          {stories.map((story, index) => {
            const palette = CARD_PALETTES[index % CARD_PALETTES.length];
            return (
              <TouchableOpacity
                key={story.id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('StoryReader', { storyId: story.id })}
                style={[styles.storyCard, { backgroundColor: palette.bg }]}
              >
                {/* Background Image */}
                {(story.imageUrl || TOPIC_IMAGES[story.topic]) && (
                  <Image
                    source={getImageSource(story.imageUrl || TOPIC_IMAGES[story.topic])}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                )}
                {/* Overlay for text readability */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />

                {/* Level badge */}
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{story.level}</Text>
                </View>

                {/* Title & meta at bottom */}
                <View style={styles.cardBottom}>
                  <Text style={[styles.cardTitle, { color: '#FFFFFF' }]} numberOfLines={2}>
                    {story.title}
                  </Text>
                  <Text style={[styles.cardMeta, { color: 'rgba(255,255,255,0.85)' }]}>
                    {story.estimatedReadTime} min · {story.wordCount} words
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ---- WORD OF THE DAY ---- */}
        {dailyWord && (
          <>
            <Text style={styles.sectionTitle}>Word of the Day</Text>
            <View style={styles.wordCard}>
              <View style={styles.wordCardLeft}>
                <View style={styles.wordPosChip}>
                  <Text style={styles.wordPosText}>{dailyWord.partOfSpeech}</Text>
                </View>
                <Text style={styles.wordCardWord}>{dailyWord.word}</Text>
                <Text style={styles.wordCardTranslation}>{dailyWord.translation}</Text>
              </View>
              <TouchableOpacity style={styles.wordSoundBtn}>
                <Ionicons name="volume-medium" size={22} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ---- CONTINUE LEARNING (categories with preview) ---- */}
        <Text style={styles.sectionTitle}>Explore by topic</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {['travel', 'food', 'culture', 'daily life', 'nature'].map((topic) => (
            <TouchableOpacity 
              key={topic} 
              style={[
                styles.catChip, 
                selectedHomeTopic === topic && styles.catChipActive
              ]} 
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(topic)}
            >
              <View style={styles.catImageWrap}>
                <Image
                  source={getImageSource(TOPIC_IMAGES[topic])}
                  style={styles.catImage}
                />
              </View>
              <Text style={[
                styles.catLabel,
                selectedHomeTopic === topic && styles.catLabelActive
              ]}>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Topic Preview List */}
        <View style={styles.topicPreviewList}>
          {topicStories.length > 0 ? (
            topicStories.map((story, i) => (
              <TouchableOpacity
                key={story.id}
                style={styles.topicMiniCard}
                onPress={() => navigation.navigate('StoryReader' as any, { storyId: story.id })}
                activeOpacity={0.8}
              >
                <Image source={getImageSource(story.imageUrl)} style={styles.topicMiniImg} />
                <View style={styles.topicMiniInfo}>
                  <Text style={styles.topicMiniTitle} numberOfLines={1}>{story.title}</Text>
                  <Text style={styles.topicMiniLevel}>{story.level} · {story.estimatedReadTime} min read</Text>
                </View>
                <Ionicons name="play-circle-outline" size={24} color={Colors.primary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyTopic}>
              <Text style={styles.emptyTopicText}>No stories found for this topic yet.</Text>
            </View>
          )}
        </View>

      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: 52, paddingBottom: 4,
  },
  greeting: { fontSize: FontSizes.sm, color: Colors.textMuted },
  name: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: 1 },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textInverse },

  // Stats bar (Headway split)
  statsBar: {
    flexDirection: 'row', alignItems: 'stretch',
    marginHorizontal: Spacing.xl, marginTop: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', ...Shadows.soft,
  },
  statsStreak: {
    width: 76, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.surfaceLight,
  },
  statsStreakLabel: { fontSize: 9, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.5 },
  statsStreakRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  streakFireEmoji: { fontSize: 14 },
  statsStreakNum: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.accent },
  statsStreakUnit: { fontSize: 9, color: Colors.textMuted, marginTop: 1 },
  statsVertDivider: { width: 1, backgroundColor: Colors.border },
  statsGrowth: { flex: 1, paddingVertical: 10, paddingHorizontal: 14 },
  statsGrowthTitle: {
    fontSize: 10, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8,
  },
  statsMetrics: { flexDirection: 'row', justifyContent: 'space-around' },
  metric: { alignItems: 'center' },
  metricNum: { fontSize: FontSizes.lg, fontWeight: '800' },
  metricLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 1 },

  // Mission banner (Headway green CTA)
  missionBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: Spacing.xl, marginTop: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.sm,
    paddingHorizontal: 14, paddingVertical: 11,
    ...Shadows.glow,
  },
  missionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  missionText: {
    fontSize: 12, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // Grammar Card
  grammarCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E8963E', // Amber color
    ...Shadows.soft,
  },
  grammarCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  grammarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  grammarBadge: {
    backgroundColor: 'rgba(232, 150, 62, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  grammarBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E8963E',
  },
  grammarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  grammarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  grammarNewBadge: {
    backgroundColor: '#E8963E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  grammarNewBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  grammarSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  grammarCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grammarProgressRail: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginRight: 16,
  },
  grammarProgressFill: {
    height: '100%',
    backgroundColor: '#E8963E',
    borderRadius: 3,
  },
  grammarCta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8963E',
  },

  // Section
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingRight: Spacing.xl,
  },
  sectionActions: { flexDirection: 'row', gap: 6, marginBottom: Spacing.sm },
  actionBtn: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm,
    ...Shadows.soft,
  },
  actionText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl, marginTop: Spacing.lg,
  },
  sectionSub: {
    fontSize: FontSizes.xs, color: Colors.textMuted,
    paddingHorizontal: Spacing.xl, marginTop: 2, marginBottom: Spacing.sm,
  },

  // Horizontal story cards (MasterClass large visual)
  cardsScroll: { paddingHorizontal: Spacing.xl, gap: 12 },
  storyCard: {
    width: CARD_W, height: CARD_W * 1.2,
    borderRadius: BorderRadius.lg,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Shadows.medium,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  cardBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  cardBottom: {},
  cardTitle: { fontSize: FontSizes.md, fontWeight: '700', lineHeight: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  cardMeta: { fontSize: 11, marginTop: 4, fontWeight: '600' },

  // Word of the day (colored card)
  wordCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.xl, marginTop: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md, padding: 14,
    ...Shadows.warm,
  },
  wordCardLeft: { flex: 1 },
  wordPosChip: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full,
    marginBottom: 6,
  },
  wordPosText: { fontSize: 9, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  wordCardWord: { fontSize: FontSizes.xl, fontWeight: '700', color: '#FFFFFF' },
  wordCardTranslation: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontStyle: 'italic' },
  wordSoundBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Category chips (Headway style with emoji)
  catScroll: { paddingHorizontal: 24, paddingVertical: 10 },
  catChip: {
    alignItems: 'center',
    marginRight: 20,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
    ...Shadows.soft,
  },
  catImageWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    marginBottom: 8,
    ...Shadows.soft,
  },
  catImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  topicPreviewList: {
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 40,
  },
  topicMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    ...Shadows.soft,
  },
  topicMiniImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 16,
  },
  topicMiniInfo: {
    flex: 1,
  },
  topicMiniTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  topicMiniLevel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  emptyTopic: {
    padding: 30,
    alignItems: 'center',
  },
  emptyTopicText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});

export default HomeScreen;
