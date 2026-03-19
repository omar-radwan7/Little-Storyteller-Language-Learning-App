// ==========================================
// Sign Up Screen — Split colored header + form
// Matches SignIn screen structure
// ==========================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { signUp } from '../services/auth';

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      let message = error.message || 'An error occurred.';
      if (error.code === 'auth/email-already-in-use') message = 'Email already in use.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/weak-password') message = 'Password is too weak.';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = () => {
    if (password.length === 0) return { label: '', color: 'transparent', pct: 0 };
    if (password.length < 4) return { label: 'weak', color: Colors.error, pct: 25 };
    if (password.length < 6) return { label: 'fair', color: Colors.warning, pct: 50 };
    if (password.length < 8) return { label: 'good', color: Colors.info, pct: 75 };
    return { label: 'strong', color: Colors.success, pct: 100 };
  };
  const strength = getStrength();

  return (
    <View style={styles.container}>
      {/* Colored top section */}
      <View style={styles.topSection}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.brandEmoji}>✨</Text>
        <Text style={styles.brandName}>Get Started</Text>
        <Text style={styles.brandSub}>Create your account</Text>
      </View>

      {/* Form card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formWrap}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.formCard,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Name */}
            <View style={[styles.inputBox, focusedInput === 'name' && styles.inputBoxFocused]}>
              <Ionicons name="person-outline" size={16} color={focusedInput === 'name' ? Colors.teal : Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Email */}
            <View style={[styles.inputBox, focusedInput === 'email' && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={16} color={focusedInput === 'email' ? Colors.teal : Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Password */}
            <View style={[styles.inputBox, focusedInput === 'password' && styles.inputBoxFocused]}>
              <Ionicons name="lock-closed-outline" size={16} color={focusedInput === 'password' ? Colors.teal : Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Password (min 6 chars)"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={16} color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Password strength */}
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={styles.strengthTrack}>
                  <View style={[styles.strengthFill, { width: `${strength.pct}%`, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}

            {/* Confirm password */}
            <View style={[styles.inputBox, focusedInput === 'confirm' && styles.inputBoxFocused]}>
              <Ionicons name="shield-checkmark-outline" size={16} color={focusedInput === 'confirm' ? Colors.teal : Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={Colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('confirm')}
                onBlur={() => setFocusedInput(null)}
              />
              {confirmPassword.length > 0 && (
                <Ionicons
                  name={password === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={password === confirmPassword ? Colors.success : Colors.error}
                />
              )}
            </View>

            {/* Create btn */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.85}
              style={styles.createBtn}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.createBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Bottom */}
            <View style={styles.bottom}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.bottomLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.teal },

  topSection: {
    alignItems: 'center', paddingTop: 48, paddingBottom: 20,
  },
  backBtn: {
    position: 'absolute', top: 50, left: 20,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  brandEmoji: { fontSize: 32, marginBottom: 8 },
  brandName: { fontSize: FontSizes.xxl, fontWeight: '800', color: '#FFFFFF' },
  brandSub: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.65)', marginTop: 3 },

  formWrap: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formCard: {
    flex: 1, backgroundColor: Colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl, paddingTop: 24, paddingBottom: 36,
  },

  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 8,
  },
  inputBoxFocused: { borderColor: Colors.teal },
  input: {
    flex: 1, color: Colors.textPrimary,
    fontSize: FontSizes.md, fontWeight: '500',
  },

  strengthRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 8, gap: 8, paddingHorizontal: 2,
  },
  strengthTrack: {
    flex: 1, height: 3, backgroundColor: Colors.border, borderRadius: 2,
  },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { fontSize: 10, fontWeight: '700' },

  createBtn: {
    backgroundColor: Colors.teal, height: 48, borderRadius: BorderRadius.sm,
    alignItems: 'center', justifyContent: 'center', marginTop: 14,
  },
  createBtnText: {
    fontSize: FontSizes.md, fontWeight: '700',
    color: Colors.textInverse,
  },
  bottom: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: Spacing.md,
  },
  bottomText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  bottomLink: { color: Colors.teal, fontSize: FontSizes.sm, fontWeight: '700' },
});

export default SignUpScreen;
