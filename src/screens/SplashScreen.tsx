// ==========================================
// Splash Screen — Minimal warm editorial feel
// ==========================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, FontSizes, Spacing } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const dotOpacity1 = useRef(new Animated.Value(0)).current;
  const dotOpacity2 = useRef(new Animated.Value(0)).current;
  const dotOpacity3 = useRef(new Animated.Value(0)).current;
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  useEffect(() => {
    // Staggered animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(150, [
        Animated.timing(dotOpacity1, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dotOpacity2, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dotOpacity3, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        if (isAuthenticated && hasCompletedOnboarding) {
          navigation.replace('MainTabs');
        } else if (isAuthenticated) {
          navigation.replace('Onboarding');
        } else {
          navigation.replace('SignIn');
        }
      }, 2200);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      {/* Warm ambient circles */}
      <View style={styles.ambientCircle1} />
      <View style={styles.ambientCircle2} />
      <View style={styles.ambientCircle3} />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoBox,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Text style={styles.logoLetter}>L</Text>
          <View style={styles.logoAccent} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }],
          }}
        >
          <Text style={styles.appName}>lingua</Text>
          <Text style={styles.tagline}>stories that teach</Text>
        </Animated.View>
      </View>

      <View style={styles.dotsRow}>
        <Animated.View style={[styles.loadDot, { opacity: dotOpacity1, backgroundColor: Colors.primary }]} />
        <Animated.View style={[styles.loadDot, { opacity: dotOpacity2, backgroundColor: Colors.accent }]} />
        <Animated.View style={[styles.loadDot, { opacity: dotOpacity3, backgroundColor: Colors.teal }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.primaryGlow,
    top: -100,
    right: -120,
  },
  ambientCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primaryMuted,
    bottom: 50,
    left: -100,
  },
  ambientCircle3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.tealMuted,
    top: height * 0.35,
    left: -40,
  },
  center: {
    alignItems: 'center',
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  logoLetter: {
    fontSize: 52,
    fontWeight: '200',
    color: Colors.primary,
    letterSpacing: -2,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.primary,
  },
  appName: {
    fontSize: FontSizes.hero,
    fontWeight: '200',
    color: Colors.textPrimary,
    letterSpacing: 8,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  tagline: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
  },
  loadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default SplashScreen;
