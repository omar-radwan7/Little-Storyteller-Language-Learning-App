// ==========================================
// Onboarding Screen — Warm Editorial 3-Step
// Vertical tile-based selection, not horizontal scroll
// ==========================================

import React, { useState, useRef } from 'react';
import {
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { LANGUAGES, LEVELS, DAILY_GOALS } from '../data/constants';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/auth';

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { firebaseUser, setUserProfile, userProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateStep = (forward: boolean, cb: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0, duration: 150, useNativeDriver: true,
    }).start(() => {
      cb();
      slideAnim.setValue(forward ? 40 : -40);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (step === 0 && !selectedLanguage) {
      Alert.alert('Choose a Language', 'Tap the language you want to learn.');
      return;
    }
    if (step === 1 && !selectedLevel) {
      Alert.alert('Choose a Level', 'Tap your current skill level.');
      return;
    }
    if (step < 2) {
      animateStep(true, () => setStep(step + 1));
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) animateStep(false, () => setStep(step - 1));
  };

  const handleComplete = async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    try {
      await updateUserProfile(firebaseUser.uid, {
        targetLanguage: selectedLanguage,
        level: selectedLevel,
        dailyGoal: selectedGoal,
      });
      setUserProfile({
        ...(userProfile || {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          streak: 0, lastActiveDate: null,
        }),
        targetLanguage: selectedLanguage,
        level: selectedLevel,
        dailyGoal: selectedGoal,
      });
      navigation.replace('MainTabs');
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------- RENDER STEPS --------

  const renderLanguageStep = () => {
    const tileWidth = (width - Spacing.xl * 2 - Spacing.md) / 2;
    return (
      <View>
        <View style={styles.languageGrid}>
          {LANGUAGES.map((lang) => {
            const selected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                activeOpacity={0.7}
                style={[
                  styles.langTile,
                  { width: tileWidth },
                  selected && styles.langTileSelected,
                ]}
              >
                <View style={[styles.langBadge, { backgroundColor: selected ? Colors.primary : Colors.border }]}>
                  <Text style={styles.langBadgeText}>{lang.code.toUpperCase()}</Text>
                </View>
                <Text style={[styles.langName, selected && styles.langNameSelected]}>
                  {lang.name}
                </Text>
                <Text style={styles.langNative}>{lang.nativeName}</Text>
                {selected && (
                  <View style={styles.selectedDot}>
                    <Ionicons name="checkmark" size={12} color={Colors.textInverse} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLevelStep = () => (
    <View style={styles.levelContainer}>
      {LEVELS.map((level) => {
        const selected = selectedLevel === level.code;
        return (
          <TouchableOpacity
            key={level.code}
            onPress={() => setSelectedLevel(level.code)}
            activeOpacity={0.7}
            style={[styles.levelTile, selected && styles.levelTileSelected]}
          >
            <View style={styles.levelRow}>
              <View style={[styles.levelCodeBox, { borderColor: level.color }]}>
                <Text style={[styles.levelCodeText, { color: level.color }]}>{level.code}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={[styles.levelName, selected && { color: Colors.textPrimary }]}>
                  {level.name}
                </Text>
                <Text style={styles.levelDesc} numberOfLines={2}>{level.description}</Text>
              </View>
              {selected ? (
                <View style={[styles.radioOuter, { borderColor: Colors.primary }]}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radioOuter} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderGoalStep = () => (
    <View style={styles.goalContainer}>
      {DAILY_GOALS.map((goal) => {
        const selected = selectedGoal === goal.count;
        return (
          <TouchableOpacity
            key={goal.count}
            onPress={() => setSelectedGoal(goal.count)}
            activeOpacity={0.7}
            style={[styles.goalTile, selected && styles.goalTileSelected]}
          >
            <View style={styles.goalLeft}>
              <View style={[styles.goalCircle, selected && { backgroundColor: Colors.primaryMuted }]}>
                <Ionicons 
                  name={goal.count === 1 ? "cafe-outline" : goal.count === 3 ? "book-outline" : "rocket-outline"} 
                  size={24} 
                  color={selected ? Colors.primary : Colors.textMuted} 
                />
              </View>
              <View>
                <Text style={[styles.goalTitle, selected && { color: Colors.primary }]}>
                  {goal.label}
                </Text>
                <Text style={styles.goalSubtext}>{goal.description}</Text>
              </View>
            </View>
            {selected ? (
              <View style={[styles.radioOuter, { borderColor: Colors.primary }]}>
                <View style={styles.radioInner} />
              </View>
            ) : (
              <View style={styles.radioOuter} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const stepData = [
    { label: 'STEP 1 OF 3', title: 'Pick your\nlanguage' },
    { label: 'STEP 2 OF 3', title: 'Your current\nlevel' },
    { label: 'STEP 3 OF 3', title: 'Daily reading\ngoal' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.ambient} />

      {/* Top bar */}
      <View style={styles.topBar}>
        {step > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: `${((step + 1) / 3) * 100}%` }]}
          />
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Step header */}
          <View style={styles.stepHeader}>
            <Text style={styles.stepLabel}>{stepData[step].label}</Text>
            <Text style={styles.stepTitle}>{stepData[step].title}</Text>
          </View>

          {step === 0 && renderLanguageStep()}
          {step === 1 && renderLevelStep()}
          {step === 2 && renderGoalStep()}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={isLoading}
          activeOpacity={0.8}
          style={[
            styles.nextBtn,
            step === 2 && { backgroundColor: Colors.teal },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <>
              <Text style={styles.nextBtnText}>{step === 2 ? "Let's Go" : 'Continue'}</Text>
              <Ionicons
                name={step === 2 ? 'sparkles-outline' : 'arrow-forward'}
                size={18}
                color={Colors.textInverse}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  ambient: {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundColor: Colors.primaryMuted, top: -150, right: -150,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  progressTrack: {
    flex: 1, height: 3, backgroundColor: Colors.border, borderRadius: 2,
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.primary, borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },
  stepHeader: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  stepEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  stepLabel: {
    fontSize: FontSizes.xs, color: Colors.primary,
    letterSpacing: 3, fontWeight: '700', marginBottom: Spacing.sm,
  },
  stepTitle: {
    fontSize: FontSizes.xxxl, fontWeight: '300',
    color: Colors.textPrimary, lineHeight: 44,
  },
  // --- Language grid (2 columns + 1 at bottom center) ---
  languageGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', gap: Spacing.md,
  },
  langTile: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingVertical: Spacing.xl, 
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    ...Shadows.soft,
  },
  langTileSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  langBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: Spacing.sm,
  },
  langBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.textInverse },
  langName: {
    fontSize: FontSizes.lg, fontWeight: '600',
    color: Colors.textSecondary, marginBottom: 2,
  },
  langNameSelected: { color: Colors.textPrimary },
  langNative: { fontSize: FontSizes.sm, color: Colors.textMuted },
  selectedDot: {
    position: 'absolute', top: 12, right: 12,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  selectedDotInner: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textInverse,
  },
  // --- Level list ---
  levelContainer: { gap: Spacing.sm },
  levelTile: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border,
    padding: Spacing.md + 4,
    ...Shadows.soft,
  },
  levelTileSelected: {
    borderColor: Colors.primary, backgroundColor: Colors.primaryMuted,
  },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelCodeBox: {
    width: 48, height: 48, borderRadius: BorderRadius.sm,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  levelCodeText: { fontSize: FontSizes.lg, fontWeight: '800' },
  levelInfo: { flex: 1 },
  levelName: {
    fontSize: FontSizes.md, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2,
  },
  levelDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, lineHeight: 18 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  radioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary,
  },
  // --- Goal list ---
  goalContainer: { gap: Spacing.md },
  goalTile: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.lg,
    ...Shadows.soft,
  },
  goalTileSelected: {
    borderColor: Colors.primary, backgroundColor: Colors.primaryMuted,
  },
  goalLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  goalCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  goalEmoji: { fontSize: 32, marginRight: Spacing.md },
  goalTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2 },
  goalSubtext: { fontSize: FontSizes.sm, color: Colors.textMuted },
  // --- Footer ---
  footer: {
    paddingHorizontal: Spacing.xl, paddingBottom: 40, paddingTop: Spacing.md,
  },
  nextBtn: {
    backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, ...Shadows.warm,
  },
  nextBtnText: {
    fontSize: FontSizes.lg, fontWeight: '600', color: Colors.textInverse, letterSpacing: 0.5,
  },
});

export default OnboardingScreen;
