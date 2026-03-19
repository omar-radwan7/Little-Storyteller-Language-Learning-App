// ==========================================
// Onboarding Screen — Drops-inspired
// Bold colored backgrounds, solid pill buttons,
// flag emojis, minimal & punchy
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

// Drops-inspired solid colors
const DROPS_PURPLE = '#4A1B7D'; 
const DROPS_LIME = '#D4E157';
const STEP_COLORS = [DROPS_PURPLE, DROPS_PURPLE, DROPS_PURPLE];

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

  const bgColor = STEP_COLORS[step];

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

  // -------- STEP 1: Languages (Drops-style solid pills) --------
  const renderLanguageStep = () => (
    <View style={styles.stepBody}>
      {LANGUAGES.map((lang) => {
        const selected = selectedLanguage === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setSelectedLanguage(lang.code)}
            activeOpacity={0.8}
            style={[
              styles.langPill,
              selected && styles.langPillSelected,
            ]}
          >
            <View style={styles.langPillInner}>
              <View style={styles.langIconCircle}>
                <Text style={styles.langFlag}>{lang.flag}</Text>
              </View>
              <Text style={[styles.langName, selected && styles.langNameSelected]}>
                {lang.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // -------- STEP 2: Levels (horizontal cards) --------
  const renderLevelStep = () => (
    <View style={styles.stepBody}>
      {LEVELS.map((level) => {
        const selected = selectedLevel === level.code;
        return (
          <TouchableOpacity
            key={level.code}
            onPress={() => setSelectedLevel(level.code)}
            activeOpacity={0.8}
            style={[styles.levelPill, selected && styles.levelPillSelected]}
          >
            <View style={styles.levelCodeCircle}>
              <Text style={styles.levelCodeText}>{level.code}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{level.name}</Text>
              <Text style={styles.levelDesc} numberOfLines={1}>{level.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // -------- STEP 3: Goals --------
  const renderGoalStep = () => {
    const goalIcons = ['☕', '📚', '🚀'];
    return (
      <View style={styles.stepBody}>
        {DAILY_GOALS.map((goal, i) => {
          const selected = selectedGoal === goal.count;
          return (
            <TouchableOpacity
              key={goal.count}
              onPress={() => setSelectedGoal(goal.count)}
              activeOpacity={0.8}
              style={[styles.goalPill, selected && styles.goalPillSelected]}
            >
              <Text style={styles.goalEmoji}>{goalIcons[i]}</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.label}</Text>
                <Text style={styles.goalDesc}>{goal.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const stepData = [
    { title: 'I want to learn' },
    { title: 'My current level' },
    { title: 'My daily goal' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.topBar}>
        {step > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.helpBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
        <View style={styles.topProgressRail}>
           <View style={[styles.topProgressFill, { width: `${((step + 1) / 3) * 100}%` }]} />
        </View>
        <TouchableOpacity style={styles.helpBtn}>
           <Text style={styles.helpBtnText}>?</Text>
        </TouchableOpacity>
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
          {/* Step title */}
          <Text style={styles.stepTitle}>{stepData[step].title}</Text>

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
          activeOpacity={0.85}
          style={styles.nextBtn}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.nextBtnText}>
              {step === 2 ? "Let's Go!" : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: 12,
  },
  topProgressRail: {
    flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4, marginHorizontal: 16, overflow: 'hidden',
  },
  topProgressFill: {
     height: '100%', backgroundColor: DROPS_LIME,
     borderRadius: 4,
  },
  helpBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  helpBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', opacity: 0.6 },
  
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  stepTitle: {
    fontSize: 28, fontWeight: '800', color: '#FFFFFF',
    marginTop: 20, marginBottom: 32,
  },
  stepBody: { gap: 12 },

  langPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30, paddingVertical: 14, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'transparent',
  },
  langPillSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  langPillInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  langIconCircle: {
     width: 44, height: 44, borderRadius: 22,
     backgroundColor: 'rgba(255,255,255,0.15)',
     alignItems: 'center', justifyContent: 'center',
     borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
  },
  langFlag: { fontSize: 20 },
  langName: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  langNameSelected: { fontWeight: '700' },

  levelPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30, paddingVertical: 14, paddingHorizontal: 16,
    gap: 14,
  },
  levelPillSelected: { backgroundColor: 'rgba(255,255,255,0.2)' },
  levelCodeCircle: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  levelCodeText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  levelDesc: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  goalPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30, paddingVertical: 16, paddingHorizontal: 16,
    gap: 14,
  },
  goalPillSelected: { backgroundColor: 'rgba(255,255,255,0.2)' },
  goalEmoji: { fontSize: 24 },
  goalInfo: { flex: 1 },
  goalTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  goalDesc: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },

  footer: { paddingHorizontal: 32, paddingBottom: 40 },
  nextBtn: {
    backgroundColor: '#FFFFFF', height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  nextBtnText: { fontSize: 18, fontWeight: '800', color: '#4A1B7D' },
});

export default OnboardingScreen;
