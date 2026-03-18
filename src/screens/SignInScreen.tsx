// ==========================================
// Sign In Screen — Warm minimal editorial
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
        // Check fragment (#access_token=...)
        const fragment = result.url.split('#')[1];
        if (fragment) {
          accessToken = new URLSearchParams(fragment).get('access_token');
        }
        // Check query string (?access_token=...)
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
      {/* Background ambient */}
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
            {/* Minimal header */}
            <View style={styles.header}>
              <View style={styles.headerLine} />
              <Text style={styles.welcomeSmall}>WELCOME BACK</Text>
              <Text style={styles.title}>Sign in to{'\n'}your account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <View
                style={[
                  styles.inputWrap,
                  focusedInput === 'email' && styles.inputWrapFocused,
                ]}
              >
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
              <View
                style={[
                  styles.inputWrap,
                  focusedInput === 'password' && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
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

              {/* Sign In button */}
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={isLoading}
                activeOpacity={0.8}
                style={styles.signInBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.textInverse} />
                ) : (
                  <Text style={styles.signInBtnText}>Continue</Text>
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
                activeOpacity={0.8}
                onPress={handleGooglePress}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <>
                    <Text style={styles.googleG}>G</Text>
                    <Text style={styles.googleText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

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
  container: { flex: 1, backgroundColor: Colors.background },
  ambient1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(67, 97, 238, 0.06)',
    top: -80,
    left: -100,
  },
  ambient2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(6, 214, 160, 0.06)',
    bottom: 100,
    right: -80,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  content: { flex: 1, justifyContent: 'center' },
  header: { marginBottom: Spacing.xl + 8 },
  headerLine: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginBottom: Spacing.lg,
  },
  welcomeSmall: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    letterSpacing: 4,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '300',
    color: Colors.textPrimary,
    lineHeight: 44,
  },
  form: { marginBottom: Spacing.xl },
  inputLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm + 4,
    marginBottom: Spacing.sm,
  },
  inputWrapFocused: {
    borderBottomColor: Colors.primary,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '400',
  },
  signInBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    ...Shadows.warm,
  },
  signInBtnText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginHorizontal: Spacing.lg,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  googleG: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  bottomText: { color: Colors.textMuted, fontSize: FontSizes.md },
  bottomLink: { color: Colors.primary, fontSize: FontSizes.md, fontWeight: '600' },
});

export default SignInScreen;
