// ==========================================
// Auth Service — Firebase Auth Operations
// ==========================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';
import { Platform } from 'react-native';

export const signInWithGoogle = async (idToken?: string, userInfo?: { email: string; name: string; id: string; picture?: string }): Promise<FirebaseUser> => {
  if (idToken) {
    // If a token was provided (from Expo Auth Session), use it directly
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    
    // Check if user document exists, create it if not
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        name: result.user.displayName || 'Google User',
        email: result.user.email || '',
        targetLanguage: '',
        level: '',
        dailyGoal: 1,
        streak: 0,
        lastActiveDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }
    
    return result.user;
  } else if (userInfo?.email) {
    // Access-token flow: we have user info from Google but no id_token
    // Use a deterministic password based on Google ID
    const googlePassword = `google_${userInfo.id}_${userInfo.email}`;
    
    try {
      // Try to sign in if account already exists
      const result = await signInWithEmailAndPassword(auth, userInfo.email, googlePassword);
      return result.user;
    } catch (signInError: any) {
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
        // Account doesn't exist, create it
        const result = await createUserWithEmailAndPassword(auth, userInfo.email, googlePassword);
        await updateProfile(result.user, { displayName: userInfo.name });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          name: userInfo.name || 'Google User',
          email: userInfo.email,
          targetLanguage: '',
          level: '',
          dailyGoal: 1,
          streak: 0,
          lastActiveDate: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        
        return result.user;
      }
      throw signInError;
    }
  } else if (Platform.OS === 'web') {
    // Fallback for direct Web sign-in if no token was passed
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user document exists, create it if not
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        name: result.user.displayName || 'Google User',
        email: result.user.email || '',
        targetLanguage: '',
        level: '',
        dailyGoal: 1,
        streak: 0,
        lastActiveDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }
    
    return result.user;
  }
  
  throw new Error('No login token available.');
};

export const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser> => {
  console.log('[DEBUG] Starting sign-up for:', email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('[DEBUG] Auth account created successfully');
    
    try {
      await updateProfile(userCredential.user, { displayName: name });
      console.log('[DEBUG] Profile updated with name:', name);
    } catch (profileError) {
      console.error('[DEBUG] Profile update failed (non-critical):', profileError);
    }

    // Create user document in Firestore
    console.log('[DEBUG] Attempting to create Firestore document...');
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      targetLanguage: '',
      level: '',
      dailyGoal: 1,
      streak: 0,
      lastActiveDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    console.log('[DEBUG] Firestore document created successfully');

    return userCredential.user;
  } catch (error: any) {
    console.error('[DEBUG] Sign-up failed at some point:', error);
    throw error;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid,
      name: data.name || '',
      email: data.email || '',
      targetLanguage: data.targetLanguage || '',
      level: data.level || '',
      dailyGoal: data.dailyGoal || 1,
      streak: data.streak || 0,
      lastActiveDate: data.lastActiveDate?.toDate() || null,
    };
  }

  return null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<User>
): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, updates, { merge: true });
};

export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
