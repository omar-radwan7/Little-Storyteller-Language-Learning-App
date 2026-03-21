// ==========================================
// App Constants — Languages, Levels, Goals, Sample Data
// ==========================================

import { Language, Level, DailyGoalOption, Story } from '../types';
import { Colors } from '../theme/colors';

export const LANGUAGES = [
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
];

export const TOPICS = ['travel', 'food', 'culture', 'daily life', 'nature'];

export const WORDS_OF_THE_DAY: Record<string, { word: string, translation: string, partOfSpeech: string }> = {};

export const LEVELS: Level[] = [
  {
    code: 'A1',
    name: 'Beginner',
    description: 'Can understand and use familiar everyday expressions',
    color: Colors.levelA1,
  },
  {
    code: 'A2',
    name: 'Elementary',
    description: 'Can communicate in simple and routine tasks',
    color: Colors.levelA2,
  },
  {
    code: 'B1',
    name: 'Intermediate',
    description: 'Can deal with most situations while travelling',
    color: Colors.levelB1,
  },
  {
    code: 'B2',
    name: 'Upper Intermediate',
    description: 'Can communicate with native speakers fluently',
    color: Colors.levelB2,
  },
];

export const DAILY_GOALS: DailyGoalOption[] = [
  {
    count: 1,
    label: 'Casual',
    description: '1 story per day — Light and easy',
    icon: 'cafe-outline',
  },
  {
    count: 3,
    label: 'Regular',
    description: '3 stories per day — Steady progress',
    icon: 'book-outline',
  },
  {
    count: 5,
    label: 'Intensive',
    description: '5 stories per day — Fast learner',
    icon: 'rocket-outline',
  },
];

export const TOPIC_IMAGES: Record<string, any> = {
  food: require('../../assets/stories/food.png'),
  nature: require('../../assets/stories/nature.jpg'),
  travel: require('../../assets/stories/travel.png'),
  culture: require('../../assets/stories/culture.png'),
  'daily life': require('../../assets/stories/daily_life.png'),
  technology: require('../../assets/stories/technology.png'),
};

// ==========================================
// Sample Stories (used for demo / offline)
// ==========================================

export const SAMPLE_STORIES: Story[] = [
  {
    id: 'story-de-a1-park',
    title: 'Ein Tag im Park',
    language: 'de',
    level: 'A1',
    topic: 'nature',
    content: 'Heute ist ein schöner Tag. Die Sonne scheint und der Himmel ist blau. Anna geht in den Park. Sie sieht viele Bäume und Blumen.',
    wordCount: 22,
    estimatedReadTime: 2,
    imageUrl: require('../../assets/stories/nature.jpg'),
    words: {
      Heute: { word: 'Heute', translation: 'Today', definition: 'On this present day', partOfSpeech: 'adverb', example: 'Heute ist Montag.' },
    }
  },
  {
    id: 'story-de-a1-market',
    title: 'Der Markt',
    language: 'de',
    level: 'A1',
    topic: 'food',
    content: 'Auf dem Markt gibt es viele Früchte. Äpfel sind rot und Bananen sind gelb. Ich kaufe fünf Äpfel für den Kuchen.',
    wordCount: 21,
    estimatedReadTime: 2,
    imageUrl: require('../../assets/stories/food.png'),
    words: {
      kaufe: { word: 'kaufe', translation: 'buy', definition: 'To obtain by paying money', partOfSpeech: 'verb', example: 'Ich kaufe Brot.' },
    }
  },
  {
    id: 'story-de-a2-cafe',
    title: 'Das gemütliche Café',
    language: 'de',
    level: 'A2',
    topic: 'food',
    content: 'Dieses Café ist sehr alt. Ich trinke hier jeden Morgen einen Kaffee und lese die Zeitung. Es riecht nach frischem Brot.',
    wordCount: 25,
    estimatedReadTime: 3,
    imageUrl: require('../../assets/stories/food.png'),
    words: {
      gemütliche: { word: 'gemütliche', translation: 'cozy', definition: 'Comfortable and warm', partOfSpeech: 'adjective', example: 'Ein gemütliches Zimmer.' },
    }
  }
];
