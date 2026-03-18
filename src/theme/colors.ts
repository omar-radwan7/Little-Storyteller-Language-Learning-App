// ==========================================
// Lingua App — Fresh & Vibrant Design System
// A bright, modern palette inspired by premium
// language learning apps with rich colors
// ==========================================

export const Colors = {
  // Primary — Vibrant Royal Blue
  primary: '#4361EE',
  primaryDark: '#3A56D4',
  primaryLight: '#7B93F5',
  primaryGlow: 'rgba(67, 97, 238, 0.15)',
  primaryMuted: 'rgba(67, 97, 238, 0.08)',

  // Accent — Warm Orange
  accent: '#FF6B35',
  accentDark: '#E85A2A',
  accentLight: '#FF9B73',

  // Teal (secondary)
  teal: '#06D6A0',
  tealDark: '#05B687',
  tealLight: '#6EEDC0',

  // Backgrounds — Clean Light
  background: '#F5F7FF',
  surface: '#FFFFFF',
  surfaceLight: '#EFF2FF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardHover: '#F0F3FF',

  // Text — Rich darks
  textPrimary: '#1A1D3D',
  textSecondary: '#5A5F7D',
  textMuted: '#9599B3',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E4E7F1',
  borderLight: '#EDF0FA',

  // Status
  success: '#06D6A0',
  warning: '#FFB524',
  error: '#EF476F',
  info: '#4CC9F0',

  // Glass / Overlay
  glass: 'rgba(67, 97, 238, 0.04)',
  glassBorder: 'rgba(67, 97, 238, 0.1)',
  glassHeavy: 'rgba(67, 97, 238, 0.06)',

  // Word highlight
  wordHighlight: 'rgba(67, 97, 238, 0.12)',
  wordHighlightActive: 'rgba(67, 97, 238, 0.25)',

  // Gradients
  gradientPrimary: ['#4361EE', '#7B93F5'] as const,
  gradientAccent: ['#FF6B35', '#FF9B73'] as const,
  gradientWarm: ['#FF6B35', '#FFB524'] as const,
  gradientDark: ['#1A1D3D', '#2D3161'] as const,
  gradientCard: ['#FFFFFF', '#F5F7FF'] as const,
  gradientHero: ['#4361EE', '#06D6A0'] as const,
  gradientSurface: ['#F5F7FF', '#FFFFFF'] as const,

  // Level colors
  levelA1: '#06D6A0',
  levelA2: '#4CC9F0',
  levelB1: '#FFB524',
  levelB2: '#FF6B35',
  levelC1: '#EF476F',

  // Tag colors for topics
  tagTravel: '#4CC9F0',
  tagFood: '#FF6B35',
  tagCulture: '#9B5DE5',
  tagDaily: '#06D6A0',
  tagNature: '#06D6A0',
  tagTech: '#4361EE',
};

export const Shadows = {
  soft: {
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: {
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  warm: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
  hero: 42,
};
