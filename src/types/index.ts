// ==========================================
// Lingua App — Type Definitions
// ==========================================

export interface User {
  uid: string;
  name: string;
  email: string;
  targetLanguage: string;
  level: string;
  dailyGoal: number;
  streak: number;
  lastActiveDate: Date | null;
}

export interface SavedWord {
  id: string;
  word: string;
  translation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  sourceStory: string;
  sourceStoryId: string;
  savedAt: Date;
}

export interface CompletedStory {
  storyId: string;
  completedAt: Date;
}

export interface WordDetail {
  word: string;
  translation: string;
  definition: string;
  partOfSpeech: string;
  example: string;
}

export interface Story {
  id: string;
  title: string;
  language: string;
  level: string;
  topic: string;
  content: string;
  wordCount: number;
  estimatedReadTime: number;
  words: Record<string, WordDetail>;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export interface Level {
  code: string;
  name: string;
  description: string;
  color: string;
}

export interface DailyGoalOption {
  count: number;
  label: string;
  description: string;
  icon: string;
}

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  StoryReader: { storyId: string };
  Flashcards: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Vocabulary: undefined;
  Progress: undefined;
  Profile: undefined;
};
