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
  grammarProgress?: {
    currentLesson: string;
    lastLessonTitle: string;
    lastActiveDate: string;
    firstTime: boolean;
    completedLessons: string[];
  };
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
  imageUrl?: any;
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

export interface GrammarTable {
  title: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface GrammarNote {
  title: string;
  text: string;
}

export interface GrammarExample {
  german: string;
  english: string;
  explanation?: string;
}

export interface GrammarExercise {
  type: 'multiple_choice' | 'fill_blank' | 'write' | 'match' | 'table_fill' | 'reorder' | 'listen_and_answer';
  text?: string;
  question?: string;
  audio_text?: string; // Content to play in TTS for listen_and_answer
  options?: string[];
  correctAnswer?: string | string[];
  blankIndex?: number;
  pairs?: { left: string; right: string }[];
  headers?: string[];
  rows?: string[][];
  correctAnswers?: string[];
  words?: string[]; // for reorder
  hint?: string; // Hint shown before answering
  explanation?: string; // Explanation shown in the feedback box after answering (right OR wrong)
}

export interface GrammarLessonType {
  language: string;
  level: string;
  id: string;
  order: number;
  title: string;
  description: string;
  explanation: string;
  tables: GrammarTable[];
  deep_notes: GrammarNote[];
  examples: GrammarExample[];
  exercises: GrammarExercise[];
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
  GrammarLesson: { lessonId: string };
  GrammarMap: undefined;
  PreferencePicker: { type: 'language' | 'level' };
  Flashcards: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Vocabulary: undefined;
  Progress: undefined;
  Profile: undefined;
  PreferencePicker: { type: 'language' | 'level' };
};
