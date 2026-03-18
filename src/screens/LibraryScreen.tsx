// ==========================================
// Library Screen — Filterable story list
// ==========================================

import React, { useState, useMemo } from 'react';
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
import { SAMPLE_STORIES, LEVELS, TOPICS, TOPIC_ICONS } from '../data/constants';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

const LibraryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const stories = useMemo(() => {
    let filtered = SAMPLE_STORIES.filter(
      (s) => s.language === (userProfile?.targetLanguage || 'de')
    );
    if (selectedLevel !== 'All') {
      filtered = filtered.filter((s) => s.level === selectedLevel);
    }
    if (selectedTopic !== 'All') {
      filtered = filtered.filter((s) => s.topic === selectedTopic);
    }
    return filtered.length > 0 ? filtered : SAMPLE_STORIES;
  }, [selectedLevel, selectedTopic, userProfile?.targetLanguage]);

  const levelOptions = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
  const topicOptions = ['All', ...TOPICS];

  return (
    <View style={styles.container}>
      <View style={styles.ambient} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSmall}>BROWSE</Text>
          <Text style={styles.headerTitle}>Story Library</Text>
        </View>

        {/* Level filter */}
        <Text style={styles.filterLabel}>LEVEL</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {levelOptions.map((level) => {
            const active = selectedLevel === level;
            const lvl = LEVELS.find((l) => l.code === level);
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedLevel(level)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                {lvl && <View style={[styles.filterDot, { backgroundColor: lvl.color }]} />}
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Topic filter */}
        <Text style={styles.filterLabel}>TOPIC</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {topicOptions.map((topic) => {
            const active = selectedTopic === topic;
            return (
              <TouchableOpacity
                key={topic}
                onPress={() => setSelectedTopic(topic)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                {topic !== 'All' && <Text style={styles.topicIcon}>{TOPIC_ICONS[topic]}</Text>}
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive, { textTransform: 'capitalize' }]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultCount}>{stories.length} stories found</Text>

        {/* Stories */}
        {stories.map((story, index) => {
          const lvl = LEVELS.find((l) => l.code === story.level) || LEVELS[0];
          return (
            <TouchableOpacity
              key={story.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('StoryReader', { storyId: story.id })}
              style={styles.storyCard}
            >
              <View style={styles.storyCardTop}>
                <View style={styles.storyCardLeft}>
                  <View style={[styles.storyIconBox, { borderColor: lvl.color + '40' }]}>
                    <Text style={styles.storyIcon}>{TOPIC_ICONS[story.topic] || '📖'}</Text>
                  </View>
                </View>
                <View style={styles.storyCardInfo}>
                  <Text style={styles.storyCardTitle}>{story.title}</Text>
                  <View style={styles.storyCardMeta}>
                    <View style={[styles.levelMiniPill, { backgroundColor: lvl.color + '20' }]}>
                      <Text style={[styles.levelMiniText, { color: lvl.color }]}>{story.level}</Text>
                    </View>
                    <Text style={styles.storyMetaText}>{story.estimatedReadTime} min</Text>
                    <Text style={styles.storyMetaDot}>·</Text>
                    <Text style={styles.storyMetaText}>{story.wordCount} words</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  ambient: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(6, 214, 160, 0.05)', top: -60, left: -80,
  },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 64, paddingBottom: Spacing.md },
  headerSmall: {
    fontSize: FontSizes.xs, color: Colors.primary, letterSpacing: 3,
    fontWeight: '700', marginBottom: Spacing.xs,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '300', color: Colors.textPrimary },
  filterLabel: {
    fontSize: FontSizes.xs, color: Colors.textMuted, letterSpacing: 2,
    fontWeight: '700', paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  filterScroll: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primaryMuted, borderColor: Colors.primary + '50',
  },
  filterPillText: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.textMuted },
  filterPillTextActive: { color: Colors.primary, fontWeight: '600' },
  filterDot: { width: 6, height: 6, borderRadius: 3 },
  topicIcon: { fontSize: 14 },
  resultCount: {
    fontSize: FontSizes.sm, color: Colors.textMuted,
    paddingHorizontal: Spacing.xl, marginTop: Spacing.lg, marginBottom: Spacing.md,
  },
  storyCard: {
    marginHorizontal: Spacing.xl, marginBottom: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md + 4,
  },
  storyCardTop: { flexDirection: 'row', alignItems: 'center' },
  storyCardLeft: { marginRight: Spacing.md },
  storyIconBox: {
    width: 48, height: 48, borderRadius: BorderRadius.sm,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.glass,
  },
  storyIcon: { fontSize: 24 },
  storyCardInfo: { flex: 1 },
  storyCardTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  storyCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelMiniPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  levelMiniText: { fontSize: FontSizes.xs, fontWeight: '700' },
  storyMetaText: { fontSize: FontSizes.xs, color: Colors.textMuted },
  storyMetaDot: { color: Colors.textMuted },
});

export default LibraryScreen;
