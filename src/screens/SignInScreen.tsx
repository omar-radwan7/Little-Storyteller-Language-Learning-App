// ==========================================
// Sign In Screen — Warm & inviting
// Colored header section, clean form below
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
import { signIn, signInWithGoogle } from '../services/auth';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const PROXY_REDIRECT = process.env.EXPO_PUBLIC_GOOGLE_PROXY_REDIRECT;

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleGooglePress = async () => {
    setIsGoogleLoading(true);
    try {
      const scopes = encodeURIComponent('profile email');
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${WEB_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(PROXY_REDIRECT)}` +
        `&response_type=token` +
        `&scope=${scopes}` +
        `&prompt=consent`;

      console.log('[DEBUG] Opening Google Auth...');
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        'exp://192.168.0.12:8081'
      );

      console.log('[DEBUG] Browser result:', JSON.stringify(result, null, 2));

      if (result.type === 'success' && result.url) {
        let accessToken: string | null = null;
        const fragment = result.url.split('#')[1];
        if (fragment) {
          accessToken = new URLSearchParams(fragment).get('access_token');
        }
        if (!accessToken) {
          const qs = result.url.split('?')[1]?.split('#')[0];
          if (qs) accessToken = new URLSearchParams(qs).get('access_token');
        }

        console.log('[DEBUG] Access token:', accessToken ? 'YES' : 'NO');

        if (accessToken) {
          const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userInfo = await res.json();
          console.log('[DEBUG] Google user:', userInfo.email, userInfo.name);
          if (!userInfo.email) throw new Error('Could not get email from Google');
          await signInWithGoogle(undefined, userInfo);
        } else {
          Alert.alert('Sign In Failed', 'Could not get token. Please try again.');
        }
      } else {
        console.log('[DEBUG] Browser dismissed/cancelled');
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      Alert.alert('Google Sign In Failed', error.message || 'An error occurred.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (error: any) {
      let message = 'An error occurred during sign in.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') message = 'Please enter a valid email.';
      else if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Try later.';
      Alert.alert('Sign In Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Colored top section */}
      <View style={styles.topSection}>
        <Text style={styles.brandEmoji}>📖</Text>
        <Text style={styles.brandName}>Lingua</Text>
        <Text style={styles.brandSub}>Learn through stories</Text>
      </View>

      {/* White card form */}
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
            <Text style={styles.formTitle}>Welcome back</Text>

            {/* Email */}
            <View style={[styles.inputBox, focusedInput === 'email' && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={18} color={focusedInput === 'email' ? Colors.primary : Colors.textMuted} />
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
              <Ionicons name="lock-closed-outline" size={18} color={focusedInput === 'password' ? Colors.primary : Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
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
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Sign In button */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.85}
              style={styles.signInBtn}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.signInBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={styles.googleBtn}
              activeOpacity={0.85}
              onPress={handleGooglePress}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={Colors.textSecondary} />
              ) : (
                <>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Bottom */}
            <View style={styles.bottom}>
              <Text style={styles.bottomText}>New here? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.bottomLink}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },

  // Colored top
  topSection: {
    alignItems: 'center', paddingTop: 60, paddingBottom: 24,
  },
  brandEmoji: { fontSize: 36, marginBottom: 10 },
  brandName: { fontSize: FontSizes.xxl + 4, fontWeight: '800', color: '#FFFFFF' },
  brandSub: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.65)', marginTop: 3 },

  // White form area
  formWrap: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formCard: {
    flex: 1, backgroundColor: Colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl, paddingTop: 28, paddingBottom: 36,
  },
  formTitle: {
    fontSize: FontSizes.xl, fontWeight: '700',
    color: Colors.textPrimary, marginBottom: Spacing.lg,
  },

  // Input boxes
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 8,
  },
  inputBoxFocused: { borderColor: Colors.primary },
  input: {
    flex: 1, color: Colors.textPrimary,
    fontSize: FontSizes.md, fontWeight: '500',
  },

  signInBtn: {
    backgroundColor: Colors.primary, height: 48, borderRadius: BorderRadius.sm,
    alignItems: 'center', justifyContent: 'center', marginTop: 14,
  },
  signInBtnText: {
    fontSize: FontSizes.md, fontWeight: '700', color: Colors.textInverse,
  },

  divider: {
    flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: FontSizes.xs, marginHorizontal: Spacing.md },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    gap: 8,
  },
  googleG: { fontSize: 18, fontWeight: '700', color: '#4285F4' },
  googleText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },

  bottom: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: Spacing.md,
  },
  bottomText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  bottomLink: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '700' },
});

export default SignInScreen;
