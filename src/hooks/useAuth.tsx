// ==========================================
// Auth Context — Global Auth State
// ==========================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { subscribeToAuthChanges, getUserProfile } from '../services/auth';
import { User } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  setUserProfile: (profile: User | null) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  setUserProfile: () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.log('Error fetching profile:', error);
          // Create a basic profile from Firebase user
          setUserProfile({
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            targetLanguage: '',
            level: '',
            dailyGoal: 1,
            streak: 0,
            lastActiveDate: null,
          });
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAuthenticated = !!firebaseUser;
  const hasCompletedOnboarding = !!(
    userProfile?.targetLanguage && userProfile?.level
  );

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isLoading,
        isAuthenticated,
        hasCompletedOnboarding,
        setUserProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
