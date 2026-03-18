// ==========================================
// Story Reader Screen — Tappable word interaction
// Inline expansion (no bottom sheet) for word defs
// ==========================================

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { LEVELS, SAMPLE_STORIES } from '../data/constants';
import { useAuth } from '../hooks/useAuth';
import { WordDetail, Story } from '../types';
import { getStoryById } from '../services/firestore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

interface TappableWordProps {
  text: string;
  wordData: WordDetail | null;
  isActive: boolean;
  onTap: () => void;
  savedWords: Set<string>;
  onSave: (word: WordDetail) => void;
}

const TappableWord: React.FC<TappableWordProps> = ({
  text,
  wordData,
  isActive,
  onTap,
  savedWords,
  onSave,
}) => {
  const isSaved = wordData ? savedWords.has(wordData.word) : false;

  return (
    <View style={styles.wordWrapper}>
      <TouchableOpacity
        onPress={onTap}
        activeOpacity={0.6}
        style={[
          styles.wordTouchable,
          wordData && styles.wordHasData,
          isActive && styles.wordActive,
        ]}
      >
        <Text
          style={[
            styles.storyWord,
            wordData && styles.storyWordTappable,
            isActive && styles.storyWordActive,
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>

      {/* Inline expansion */}
      {isActive && wordData && (
        <View style={styles.wordExpansion}>
          <View style={styles.expansionArrow} />
          <View style={styles.expansionContent}>
            <View style={styles.expansionHeader}>
              <View>
                <Text style={styles.expansionWord}>{wordData.word}</Text>
                <Text style={styles.expansionPos}>{wordData.partOfSpeech}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onSave(wordData)}
                style={[styles.saveBtn, isSaved && styles.saveBtnSaved]}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={isSaved ? Colors.primary : Colors.textMuted}
                />
                <Text style={[styles.saveBtnText, isSaved && { color: Colors.primary }]}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.expansionDivider} />
            <Text style={styles.expansionTranslation}>{wordData.translation}</Text>
            <Text style={styles.expansionDefinition}>{wordData.definition}</Text>
            {wordData.example && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleLabel}>EXAMPLE</Text>
                <Text style={styles.exampleText}>"{wordData.example}"</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const StoryReaderScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { storyId } = route.params;
  const { userProfile } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [readProgress, setReadProgress] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        let data = await getStoryById(storyId);
        
        // FALLBACK: IfFirestore is empty, look in Sample Stories
        if (!data) {
          data = SAMPLE_STORIES.find(s => s.id === storyId) || null;
        }
        
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [storyId]);

  const levelObj = story ? LEVELS.find((l) => l.code === story.level) || LEVELS[0] : LEVELS[0];

  const handleWordTap = useCallback((word: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveWord((prev) => (prev === word ? null : word));
  }, []);

  const handleSaveWord = useCallback((wordData: WordDetail) => {
    setSavedWords((prev) => {
      const next = new Set(prev);
      if (next.has(wordData.word)) {
        next.delete(wordData.word);
      } else {
        next.add(wordData.word);
      }
      return next;
    });
  }, []);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const contentSize = event.nativeEvent.contentSize.height;
    const layoutSize = event.nativeEvent.layoutMeasurement.height;
    if (contentSize > layoutSize) {
      const pct = Math.min(100, Math.round((y / (contentSize - layoutSize)) * 100));
      setReadProgress(pct);
    }
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Story Complete',
      `You finished "${story?.title}" and saved ${savedWords.size} words.`,
      [{ text: 'Back to Home', onPress: () => navigation.goBack() }]
    );
  };

  const tokens = useMemo(() => {
    if (!story) return [];
    return story.content.split(/(\s+)/).filter((t) => t.length > 0);
  }, [story?.content]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!story) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textMuted} />
        <Text style={{ color: Colors.textPrimary, fontSize: 18, marginTop: 20, textAlign: 'center' }}>
          Story not found
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, padding: 10 }}
        >
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${readProgress}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerProgress}>{readProgress}%</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Story header info */}
        <View style={styles.storyHeader}>
          <View style={styles.storyBadges}>
            <View style={[styles.levelBadge, { backgroundColor: levelObj.color + '20' }]}>
              <Text style={[styles.levelBadgeText, { color: levelObj.color }]}>{story.level}</Text>
            </View>
            <View style={styles.topicBadge}>
              <Text style={styles.topicBadgeText}>{story.topic}</Text>
            </View>
          </View>
          <Text style={styles.storyTitle}>{story.title}</Text>
          <View style={styles.storyMeta}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{story.estimatedReadTime} min read</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{story.wordCount} words</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{Object.keys(story.words || {}).length} vocab</Text>
          </View>
        </View>

        {/* Tap hint */}
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap any word for its translation and meaning</Text>
        </View>

        {/* Story content with tappable words */}
        <View style={styles.storyContent}>
          <View style={styles.wordsContainer}>
            {tokens.map((token, index) => {
              // Check if token is whitespace
              if (/^\s+$/.test(token)) {
                return <Text key={index} style={styles.storyWord}> </Text>;
              }

              // Strip punctuation to find word data
              const cleanWord = token.replace(/[.,!?;:"'()—–\-\[\]«»„"]/g, '');
              const wordData: WordDetail | null = (story.words && story.words[cleanWord]) 
                ? story.words[cleanWord] 
                : null;

              return (
                <TappableWord
                  key={`${index}-${token}`}
                  text={token}
                  wordData={wordData}
                  isActive={activeWord === token}
                  onTap={() => handleWordTap(token)}
                  savedWords={savedWords}
                  onSave={handleSaveWord}
                />
              );
            })}
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="bookmark" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{savedWords.size}</Text>
              <Text style={styles.statLabel}>words saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="book" size={18} color={Colors.teal} />
              <Text style={styles.statValue}>{story.wordCount}</Text>
              <Text style={styles.statLabel}>total words</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleMarkComplete}
            activeOpacity={0.8}
            style={styles.completeBtn}
          >
            <Ionicons name="checkmark-circle" size={20} color={Colors.textInverse} />
            <Text style={styles.completeBtnText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  // Progress bar at top
  progressBarContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    backgroundColor: Colors.border, zIndex: 10,
  },
  progressBar: { height: '100%', backgroundColor: Colors.primary },
  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.sm,
  },
  headerBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: BorderRadius.sm, backgroundColor: Colors.surface,
  },
  headerCenter: { alignItems: 'center' },
  headerProgress: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '600' },
  // Scroll
  scrollView: { flex: 1 },
  // Story header
  storyHeader: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  storyBadges: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  levelBadge: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  levelBadgeText: { fontSize: FontSizes.xs, fontWeight: '700' },
  topicBadge: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  topicBadgeText: {
    fontSize: FontSizes.xs, fontWeight: '500', color: Colors.textMuted, textTransform: 'capitalize',
  },
  storyTitle: {
    fontSize: FontSizes.xxl + 2, fontWeight: '300', color: Colors.textPrimary,
    lineHeight: 38, marginBottom: Spacing.md,
  },
  storyMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: FontSizes.xs, color: Colors.textMuted },
  metaDot: { color: Colors.textMuted, fontSize: FontSizes.xs },
  // Tap hint
  tapHint: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    backgroundColor: Colors.primaryMuted, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, borderRadius: BorderRadius.sm,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  tapHintText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '500' },
  // Story content
  storyContent: {
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl,
  },
  wordsContainer: {
    flexDirection: 'row', flexWrap: 'wrap',
  },
  // Word styles
  wordWrapper: {
    marginBottom: 2,
  },
  wordTouchable: {
    paddingVertical: 3,
    paddingHorizontal: 1,
  },
  wordHasData: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primary + '40',
    borderRadius: 2,
  },
  wordActive: {
    backgroundColor: Colors.wordHighlightActive,
    borderRadius: 4,
    borderBottomColor: Colors.primary,
  },
  storyWord: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    lineHeight: 34,
    fontWeight: '300',
  },
  storyWordTappable: {
    color: Colors.textPrimary,
  },
  storyWordActive: {
    color: Colors.primary,
    fontWeight: '500',
  },
  // Word expansion (inline, appears below the word)
  wordExpansion: {
    marginTop: 4,
    marginBottom: 8,
    width: width - Spacing.xl * 2,
  },
  expansionArrow: {
    width: 12, height: 12,
    backgroundColor: Colors.surface,
    transform: [{ rotate: '45deg' }],
    marginLeft: 16, marginBottom: -6,
    borderWidth: 1, borderColor: Colors.border,
    borderBottomColor: 'transparent', borderRightColor: 'transparent',
  },
  expansionContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md + 4,
    ...Shadows.soft,
  },
  expansionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  expansionWord: {
    fontSize: FontSizes.xl, fontWeight: '600', color: Colors.textPrimary,
  },
  expansionPos: {
    fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase', marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
  },
  saveBtnSaved: { borderColor: Colors.primary + '40', backgroundColor: Colors.primaryMuted },
  saveBtnText: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.textMuted },
  expansionDivider: {
    height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm + 2,
  },
  expansionTranslation: {
    fontSize: FontSizes.lg, fontWeight: '500', color: Colors.primary, marginBottom: 4,
  },
  expansionDefinition: {
    fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 22,
  },
  exampleBox: {
    marginTop: Spacing.md, backgroundColor: Colors.glass,
    borderRadius: BorderRadius.sm, padding: Spacing.md,
    borderLeftWidth: 3, borderLeftColor: Colors.teal,
  },
  exampleLabel: {
    fontSize: FontSizes.xs, color: Colors.teal, fontWeight: '700',
    letterSpacing: 2, marginBottom: 4,
  },
  exampleText: {
    fontSize: FontSizes.md, color: Colors.textSecondary, fontStyle: 'italic', lineHeight: 22,
  },
  // Bottom section
  bottomSection: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.xxl,
    paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl, gap: Spacing.xl,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  completeBtn: {
    backgroundColor: Colors.teal, height: 56, borderRadius: BorderRadius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.teal, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 5,
  },
  completeBtnText: {
    fontSize: FontSizes.lg, fontWeight: '600', color: Colors.textInverse,
  },
});

export default StoryReaderScreen;
