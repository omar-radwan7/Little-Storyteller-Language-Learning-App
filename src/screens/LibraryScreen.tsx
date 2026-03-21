// ==========================================
// Library Screen — Filterable story browser
// Clean filters + card rows with topic emojis
// ==========================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { LEVELS, TOPICS, TOPIC_IMAGES, SAMPLE_STORIES } from '../data/constants';
import { Story } from '../types';
import { getStories } from '../services/firestore';
import { useAuth } from '../hooks/useAuth';
import { Image } from 'react-native';
import { getImageSource } from '../utils/imageHelper';

const { width } = Dimensions.get('window');

const LibraryScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { userProfile } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  useEffect(() => {
    if (route.params?.initialTopic) {
      setSelectedTopic(route.params.initialTopic);
      // Optional: clear params after using them to avoid re-triggering on every mount if not intended
      // navigation.setParams({ initialTopic: undefined });
    }
  }, [route.params?.initialTopic]);

  const levelMapping: Record<string, string[]> = {
    'A1': ['A1', 'A2'],
    'A2': ['A2', 'B1'],
    'B1': ['B1', 'B2'],
    'B2': ['B2'],
  };

  const allowedLevels = useMemo(() => {
    const currentLevel = userProfile?.level || 'A1';
    return levelMapping[currentLevel] || ['A1'];
  }, [userProfile?.level]);

  useEffect(() => {
    if (selectedLevel !== 'All' && !allowedLevels.includes(selectedLevel)) {
      setSelectedLevel('All');
    }
  }, [allowedLevels]);

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibraryStories = async () => {
      setLoading(true);
      try {
        const targetLang = userProfile?.targetLanguage || 'de';
        const fetched = await getStories(targetLang, allowedLevels);
        if (fetched.length === 0) {
          const fallback = SAMPLE_STORIES.filter(
            (s) => s.language === targetLang && allowedLevels.includes(s.level)
          );
          setStories(fallback);
        } else {
          setStories(fetched);
        }
      } catch (error) {
        console.error('Error loading library stories:', error);
        const errFallback = SAMPLE_STORIES.filter(
          (s) => s.language === (userProfile?.targetLanguage || 'de') && allowedLevels.includes(s.level)
        );
        setStories(errFallback);
      } finally {
        setLoading(false);
      }
    };
    loadLibraryStories();
  }, [userProfile?.targetLanguage, allowedLevels]);

  const filteredStories = useMemo(() => {
    let filtered = [...stories];
    if (selectedLevel !== 'All') {
      filtered = filtered.filter((s) => s.level === selectedLevel);
    }
    if (selectedTopic !== 'All') {
      filtered = filtered.filter((s) => s.topic === selectedTopic);
    }
    return filtered;
  }, [stories, selectedLevel, selectedTopic]);

  const levelOptions = useMemo(() => ['All', ...allowedLevels], [allowedLevels]);
  const topicOptions = ['All', ...TOPICS];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Library</Text>
          <Text style={styles.headerSub}>{filteredStories.length} stories available</Text>
        </View>

        {/* Level filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {levelOptions.map((level) => {
            const active = selectedLevel === level;
            const lvl = LEVELS.find((l) => l.code === level);
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedLevel(level)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                {lvl && <View style={[styles.filterDot, { backgroundColor: lvl.color }]} />}
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {level === 'All' ? 'All Levels' : level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Topic filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {topicOptions.map((topic) => {
            const active = selectedTopic === topic;
            return (
              <TouchableOpacity
                key={topic}
                onPress={() => setSelectedTopic(topic)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                {topic !== 'All' && (
                  <View style={styles.filterImageWrap}>
                    <Image
                      source={getImageSource(TOPIC_IMAGES[topic])}
                      style={styles.filterImage}
                    />
                  </View>
                )}
                <Text style={[styles.filterText, active && styles.filterTextActive, { textTransform: 'capitalize' }]}>
                  {topic === 'All' ? 'All Topics' : topic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stories */}
        {filteredStories.map((story) => {
          const lvl = LEVELS.find((l) => l.code === story.level) || LEVELS[0];
          return (
            <TouchableOpacity
              key={story.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('StoryReader', { storyId: story.id })}
              style={styles.storyCard}
            >
              <View style={[styles.storyEmoji, { backgroundColor: lvl.color + '12' }]}>
                <Image
                  source={getImageSource(story.imageUrl || TOPIC_IMAGES[story.topic])}
                  style={styles.storyThumbnail}
                />
              </View>
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle} numberOfLines={1}>{story.title}</Text>
                <View style={styles.storyMeta}>
                  <View style={[styles.levelChip, { backgroundColor: lvl.color + '18' }]}>
                    <Text style={[styles.levelChipText, { color: lvl.color }]}>{story.level}</Text>
                  </View>
                  <Text style={styles.metaText}>{story.estimatedReadTime} min</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{story.wordCount} words</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 52, paddingBottom: 4 },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 3 },

  filterRow: { paddingHorizontal: Spacing.xl, gap: 6, paddingVertical: 6 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
  },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.textInverse },
  filterDot: { width: 6, height: 6, borderRadius: 3 },
  filterImageWrap: { width: 14, height: 14, borderRadius: 7, overflow: 'hidden' },
  filterImage: { width: '100%', height: '100%' },

  storyCard: {
    marginHorizontal: Spacing.xl, marginBottom: 6,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12, flexDirection: 'row', alignItems: 'center',
  },
  storyEmoji: {
    width: 44, height: 44, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
    overflow: 'hidden',
  },
  storyThumbnail: { width: '100%', height: '100%' },
  storyInfo: { flex: 1 },
  storyTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  storyMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelChip: { paddingHorizontal: 7, paddingVertical: 1, borderRadius: BorderRadius.full },
  levelChipText: { fontSize: 10, fontWeight: '700' },
  metaText: { fontSize: 10, color: Colors.textMuted },
  metaDot: { color: Colors.textMuted, fontSize: 10 },
});

export default LibraryScreen;
