// ==========================================
// Sign Up Screen — Warm minimal editorial
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
      <View style={styles.ambient1} />
      <View style={styles.ambient2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.headerLine} />
              <Text style={styles.welcomeSmall}>GET STARTED</Text>
              <Text style={styles.title}>Create your{'\n'}account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={[styles.inputWrap, focusedInput === 'name' && styles.inputWrapFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <Text style={styles.inputLabel}>EMAIL</Text>
              <View style={[styles.inputWrap, focusedInput === 'email' && styles.inputWrapFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
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

              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={[styles.inputWrap, focusedInput === 'password' && styles.inputWrapFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Min 6 characters"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Password strength */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    <View style={[styles.strengthFill, { width: `${strength.pct}%`, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={[styles.strengthText, { color: strength.color }]}>{strength.label}</Text>
                </View>
              )}

              <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
              <View style={[styles.inputWrap, focusedInput === 'confirm' && styles.inputWrapFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
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
                    size={20}
                    color={password === confirmPassword ? Colors.success : Colors.error}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isLoading}
                activeOpacity={0.8}
                style={styles.createBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.textInverse} />
                ) : (
                  <Text style={styles.createBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

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
  container: { flex: 1, backgroundColor: Colors.background },
  ambient1: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(67, 97, 238, 0.06)', top: -60, right: -80,
  },
  ambient2: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: Colors.primaryMuted, bottom: 60, left: -80,
  },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl,
  },
  content: { flex: 1, justifyContent: 'center' },
  header: { marginBottom: Spacing.xl },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    marginLeft: -8, marginBottom: Spacing.md,
  },
  headerLine: {
    width: 40, height: 3, backgroundColor: Colors.teal,
    borderRadius: 2, marginBottom: Spacing.lg,
  },
  welcomeSmall: {
    fontSize: FontSizes.xs, color: Colors.teal,
    letterSpacing: 4, fontWeight: '600', marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxxl, fontWeight: '300',
    color: Colors.textPrimary, lineHeight: 44,
  },
  form: { marginBottom: Spacing.lg },
  inputLabel: {
    fontSize: FontSizes.xs, color: Colors.textMuted,
    letterSpacing: 2, fontWeight: '600',
    marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1.5, borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm + 4, marginBottom: Spacing.sm,
  },
  inputWrapFocused: { borderBottomColor: Colors.teal },
  input: {
    flex: 1, color: Colors.textPrimary,
    fontSize: FontSizes.lg, fontWeight: '400',
  },
  strengthRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: Spacing.sm, gap: Spacing.sm,
  },
  strengthTrack: {
    flex: 1, height: 2, backgroundColor: Colors.border, borderRadius: 1,
  },
  strengthFill: { height: '100%', borderRadius: 1 },
  strengthText: { fontSize: FontSizes.xs, fontWeight: '600' },
  createBtn: {
    backgroundColor: Colors.teal, height: 56, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl,
    shadowColor: Colors.teal, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 5,
  },
  createBtnText: {
    fontSize: FontSizes.lg, fontWeight: '600',
    color: Colors.textInverse, letterSpacing: 0.5,
  },
  bottom: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: Spacing.lg,
  },
  bottomText: { color: Colors.textMuted, fontSize: FontSizes.md },
  bottomLink: { color: Colors.teal, fontSize: FontSizes.md, fontWeight: '600' },
});

export default SignUpScreen;
