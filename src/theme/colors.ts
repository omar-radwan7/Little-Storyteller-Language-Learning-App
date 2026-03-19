// ==========================================
// Lingua App — "Mossy Dusk" Design System
// A nature-inspired palette: deep moss greens,
// warm ambers, soft lavender accents on a
// creamy parchment canvas. Comfortable for
// extended reading, vibrant without being loud.
// ==========================================

export const Colors = {
  // Primary — Deep Moss Green (calming, nature, learning)
  primary: '#2B6652',
  primaryDark: '#1F4D3D',
  primaryLight: '#4A9E7E',
  primaryGlow: 'rgba(43, 102, 82, 0.15)',
  primaryMuted: 'rgba(43, 102, 82, 0.08)',

  // Accent — Warm Amber (energetic, reward, CTA)
  accent: '#E8963E',
  accentDark: '#CF7D2E',
  accentLight: '#F4B76B',
  accentMuted: 'rgba(232, 150, 62, 0.10)',

  // Teal / Mint — Fresh secondary
  teal: '#3AAFA9',
  tealDark: '#2D8B86',
  tealLight: '#7DDED8',
  tealMuted: 'rgba(58, 175, 169, 0.10)',

  // Lavender — Soft purple for variety
  lavender: '#8E7CC3',
  lavenderMuted: 'rgba(142, 124, 195, 0.10)',

  // Rose — Warm pink for highlights
  rose: '#D96380',
  roseMuted: 'rgba(217, 99, 128, 0.10)',

  // Backgrounds — Warm Parchment
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceLight: '#F3EFE8',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardHover: '#F7F3ED',

  // Text — Warm rich darks
  textPrimary: '#2C2C2C',
  textSecondary: '#5E5E5E',
  textMuted: '#9D9D9D',
  textInverse: '#FFFFFF',

  // Borders — Warm
  border: '#E8E3DA',
  borderLight: '#F0ECE4',

  // Status
  success: '#3AAFA9',
  warning: '#E8963E',
  error: '#D96380',
  info: '#5B9BD5',

  // Glass / Overlay
  glass: 'rgba(43, 102, 82, 0.04)',
  glassBorder: 'rgba(43, 102, 82, 0.08)',
  glassHeavy: 'rgba(43, 102, 82, 0.06)',

  // Word highlight
  wordHighlight: 'rgba(43, 102, 82, 0.12)',
  wordHighlightActive: 'rgba(43, 102, 82, 0.25)',

  // Gradients
  gradientPrimary: ['#2B6652', '#4A9E7E'] as const,
  gradientAccent: ['#E8963E', '#F4B76B'] as const,
  gradientWarm: ['#E8963E', '#D96380'] as const,
  gradientDark: ['#2C2C2C', '#3D3D3D'] as const,
  gradientCard: ['#FFFFFF', '#FAF7F2'] as const,
  gradientHero: ['#2B6652', '#3AAFA9'] as const,
  gradientSurface: ['#FAF7F2', '#FFFFFF'] as const,

  // Level colors — each level gets a unique warm tone
  levelA1: '#3AAFA9',
  levelA2: '#5B9BD5',
  levelB1: '#E8963E',
  levelB2: '#D96380',
  levelC1: '#8E7CC3',

  // Tag / Topic colors
  tagTravel: '#5B9BD5',
  tagFood: '#E8963E',
  tagCulture: '#8E7CC3',
  tagDaily: '#3AAFA9',
  tagNature: '#2B6652',
  tagTech: '#5B9BD5',
};

export const Shadows = {
  soft: {
    shadowColor: '#2C2C2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#2C2C2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 4,
  },
  glow: {
    shadowColor: '#2B6652',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  warm: {
    shadowColor: '#E8963E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  accent: {
    shadowColor: '#E8963E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 24,
  xxl: 40,
  xxxl: 56,
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
  xxxl: 32,
  hero: 40,
};
