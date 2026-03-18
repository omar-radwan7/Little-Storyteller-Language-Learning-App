// ==========================================
// Vocabulary Screen — Saved words + flashcard mode
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
      <View style={styles.ambient} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSmall}>YOUR WORDS</Text>
          <Text style={styles.headerTitle}>Vocabulary</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{DEMO_WORDS.length}</Text>
        </View>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          onPress={() => setMode('list')}
          style={[styles.modeBtn, mode === 'list' && styles.modeBtnActive]}
        >
          <Ionicons name="list" size={16} color={mode === 'list' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.modeBtnText, mode === 'list' && styles.modeBtnTextActive]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('flashcard')}
          style={[styles.modeBtn, mode === 'flashcard' && styles.modeBtnActive]}
        >
          <Ionicons name="albums" size={16} color={mode === 'flashcard' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.modeBtnText, mode === 'flashcard' && styles.modeBtnTextActive]}>Flashcards</Text>
        </TouchableOpacity>
      </View>

      {mode === 'list' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {DEMO_WORDS.map((word) => (
            <View key={word.id} style={styles.wordItem}>
              <View style={styles.wordItemLeft}>
                <Text style={styles.wordItemWord}>{word.word}</Text>
                <View style={styles.wordItemRow}>
                  <Text style={styles.wordItemPos}>{word.partOfSpeech}</Text>
                  <Text style={styles.wordItemDot}>·</Text>
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
              <Text style={styles.cardLabel}>TAP TO REVEAL</Text>
              <Text style={styles.cardWord}>{DEMO_WORDS[currentCard].word}</Text>
              <Text style={styles.cardPos}>{DEMO_WORDS[currentCard].partOfSpeech}</Text>
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
              <Text style={styles.cardLabel}>TRANSLATION</Text>
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
  ambient: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(67, 97, 238, 0.05)', top: -80, right: -80,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl, paddingTop: 64, paddingBottom: Spacing.md,
  },
  headerSmall: {
    fontSize: FontSizes.xs, color: Colors.accent, letterSpacing: 3,
    fontWeight: '700', marginBottom: Spacing.xs,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '300', color: Colors.textPrimary },
  countBadge: {
    backgroundColor: Colors.accent + '15', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  countText: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.accent },
  // Mode toggle
  modeToggle: {
    flexDirection: 'row', marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: 4, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: BorderRadius.sm,
  },
  modeBtnActive: { backgroundColor: Colors.primaryMuted },
  modeBtnText: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.textMuted },
  modeBtnTextActive: { color: Colors.primary, fontWeight: '600' },
  // List
  listContent: { paddingHorizontal: Spacing.xl },
  wordItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.md + 2,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  wordItemLeft: { flex: 1 },
  wordItemWord: { fontSize: FontSizes.lg, fontWeight: '500', color: Colors.textPrimary, marginBottom: 4 },
  wordItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wordItemPos: { fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600', textTransform: 'uppercase' },
  wordItemDot: { color: Colors.textMuted, fontSize: FontSizes.xs },
  wordItemSource: { fontSize: FontSizes.xs, color: Colors.textMuted },
  wordItemTranslation: { fontSize: FontSizes.md, color: Colors.textSecondary, fontStyle: 'italic' },
  // Flashcards
  flashcardContainer: { flex: 1, alignItems: 'center', paddingTop: Spacing.xl },
  cardCounter: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: Spacing.lg, fontWeight: '600' },
  cardWrapper: { width: width - Spacing.xxl * 2, height: 240 },
  flashcard: {
    position: 'absolute', width: '100%', height: '100%',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    padding: Spacing.xl, ...Shadows.soft,
  },
  flashcardBack: { backgroundColor: Colors.card },
  cardLabel: {
    fontSize: FontSizes.xs, color: Colors.textMuted, letterSpacing: 3,
    fontWeight: '700', marginBottom: Spacing.md, position: 'absolute', top: 24,
  },
  cardWord: { fontSize: FontSizes.xxxl, fontWeight: '300', color: Colors.textPrimary },
  cardPos: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600', marginTop: 8, textTransform: 'uppercase' },
  cardTranslation: { fontSize: FontSizes.xxl, fontWeight: '400', color: Colors.primary },
  cardSource: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.md, fontStyle: 'italic' },
  cardNav: {
    flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.xl,
  },
  cardNavBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default VocabularyScreen;
