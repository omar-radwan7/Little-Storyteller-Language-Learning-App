// ==========================================
// Vocabulary Screen — Saved words + flashcard mode
// Warm parchment design with moss accent
// ==========================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';

const { width } = Dimensions.get('window');

// Demo saved words
const DEMO_WORDS = [
  { id: '1', word: 'Wanderlust', translation: 'desire to travel', partOfSpeech: 'noun', sourceStory: 'Die Reise nach Berlin' },
  { id: '2', word: 'Frühstück', translation: 'breakfast', partOfSpeech: 'noun', sourceStory: 'Mein Frühstück' },
  { id: '3', word: 'glücklich', translation: 'happy', partOfSpeech: 'adjective', sourceStory: 'Ein Tag im Park' },
  { id: '4', word: 'beeindruckend', translation: 'impressive', partOfSpeech: 'adjective', sourceStory: 'Die Reise nach Berlin' },
  { id: '5', word: 'Schriftsteller', translation: 'writer', partOfSpeech: 'noun', sourceStory: 'Das Geheimnis des alten Cafés' },
  { id: '6', word: 'Atmosphäre', translation: 'atmosphere', partOfSpeech: 'noun', sourceStory: 'Das Geheimnis des alten Cafés' },
  { id: '7', word: 'Landschaft', translation: 'landscape', partOfSpeech: 'noun', sourceStory: 'Die Reise nach Berlin' },
  { id: '8', word: 'freundlich', translation: 'friendly', partOfSpeech: 'adjective', sourceStory: 'Ein Tag im Park' },
];

const VocabularyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mode, setMode] = useState<'list' | 'flashcard'>('list');
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const toggleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const nextCard = () => {
    if (flipped) {
      flipAnim.setValue(0);
      setFlipped(false);
    }
    setCurrentCard((prev) => (prev + 1) % DEMO_WORDS.length);
  };

  const prevCard = () => {
    if (flipped) {
      flipAnim.setValue(0);
      setFlipped(false);
    }
    setCurrentCard((prev) => (prev - 1 + DEMO_WORDS.length) % DEMO_WORDS.length);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vocabulary</Text>
          <Text style={styles.headerSub}>{DEMO_WORDS.length} saved words</Text>
        </View>
        <View style={styles.countBadge}>
          <Ionicons name="bookmark" size={14} color={Colors.accent} />
          <Text style={styles.countText}>{DEMO_WORDS.length}</Text>
        </View>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          onPress={() => setMode('list')}
          style={[styles.modeBtn, mode === 'list' && styles.modeBtnActive]}
        >
          <Ionicons name="list" size={16} color={mode === 'list' ? Colors.textInverse : Colors.textMuted} />
          <Text style={[styles.modeBtnText, mode === 'list' && styles.modeBtnTextActive]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('flashcard')}
          style={[styles.modeBtn, mode === 'flashcard' && styles.modeBtnActive]}
        >
          <Ionicons name="albums" size={16} color={mode === 'flashcard' ? Colors.textInverse : Colors.textMuted} />
          <Text style={[styles.modeBtnText, mode === 'flashcard' && styles.modeBtnTextActive]}>Flashcards</Text>
        </TouchableOpacity>
      </View>

      {mode === 'list' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {DEMO_WORDS.map((word, index) => (
            <View key={word.id} style={styles.wordItem}>
              <View style={styles.wordItemLeft}>
                <Text style={styles.wordItemWord}>{word.word}</Text>
                <View style={styles.wordItemRow}>
                  <View style={styles.posBadge}>
                    <Text style={styles.posText}>{word.partOfSpeech}</Text>
                  </View>
                  <Text style={styles.wordItemSource}>{word.sourceStory}</Text>
                </View>
              </View>
              <Text style={styles.wordItemTranslation}>{word.translation}</Text>
            </View>
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>
      ) : (
        <View style={styles.flashcardContainer}>
          <Text style={styles.cardCounter}>
            {currentCard + 1} / {DEMO_WORDS.length}
          </Text>

          <TouchableOpacity activeOpacity={0.9} onPress={toggleFlip} style={styles.cardWrapper}>
            {/* Front */}
            <Animated.View
              style={[
                styles.flashcard,
                { transform: [{ rotateY: frontInterpolate }] },
                { backfaceVisibility: 'hidden' },
              ]}
            >
              <Text style={styles.cardHint}>TAP TO REVEAL</Text>
              <Text style={styles.cardWord}>{DEMO_WORDS[currentCard].word}</Text>
              <View style={styles.cardPosBadge}>
                <Text style={styles.cardPosText}>{DEMO_WORDS[currentCard].partOfSpeech}</Text>
              </View>
            </Animated.View>

            {/* Back */}
            <Animated.View
              style={[
                styles.flashcard,
                styles.flashcardBack,
                { transform: [{ rotateY: backInterpolate }] },
                { backfaceVisibility: 'hidden' },
              ]}
            >
              <Text style={styles.cardHint}>TRANSLATION</Text>
              <Text style={styles.cardTranslation}>{DEMO_WORDS[currentCard].translation}</Text>
              <Text style={styles.cardSource}>from: {DEMO_WORDS[currentCard].sourceStory}</Text>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.cardNav}>
            <TouchableOpacity onPress={prevCard} style={styles.cardNavBtn}>
              <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextCard} style={styles.cardNavBtn}>
              <Ionicons name="arrow-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: 52, paddingBottom: 8,
  },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentMuted, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.accent + '25',
  },
  countText: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.accent },

  // Mode toggle
  modeToggle: {
    flexDirection: 'row', marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.sm,
    padding: 3, marginBottom: Spacing.md,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 8, borderRadius: 6,
  },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  modeBtnTextActive: { color: Colors.textInverse },

  // List
  listContent: { paddingHorizontal: Spacing.xl },
  wordItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  wordItemLeft: { flex: 1 },
  wordItemWord: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 3 },
  wordItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  posBadge: {
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryMuted,
  },
  posText: { fontSize: 9, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  wordItemSource: { fontSize: 10, color: Colors.textMuted },
  wordItemTranslation: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontStyle: 'italic', maxWidth: 110, textAlign: 'right' },

  // Flashcards
  flashcardContainer: { flex: 1, alignItems: 'center', paddingTop: Spacing.lg },
  cardCounter: { fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.md, fontWeight: '600' },
  cardWrapper: { width: width - 80, height: 180 },
  flashcard: {
    position: 'absolute', width: '100%', height: '100%',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    padding: Spacing.lg, ...Shadows.soft,
  },
  flashcardBack: { backgroundColor: Colors.surfaceLight },
  cardHint: {
    fontSize: 9, color: Colors.textMuted, letterSpacing: 2,
    fontWeight: '700', position: 'absolute', top: 18,
  },
  cardWord: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.textPrimary },
  cardPosBadge: {
    marginTop: 6, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: BorderRadius.full, backgroundColor: Colors.primaryMuted,
  },
  cardPosText: { fontSize: 10, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  cardTranslation: { fontSize: FontSizes.xl, fontWeight: '600', color: Colors.primary },
  cardSource: { fontSize: 12, color: Colors.textMuted, marginTop: Spacing.sm, fontStyle: 'italic' },
  cardNav: {
    flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.lg,
  },
  cardNavBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default VocabularyScreen;
