export const colors = {
  // Primary colors with better contrast
  primary: '#4F46E5', // Indigo-600 - Better contrast
  primaryLight: '#6366F1', // Indigo-500
  primaryDark: '#3730A3', // Indigo-700
  secondary: '#7C3AED', // Violet-600
  secondaryLight: '#8B5CF6', // Violet-500
  accent: '#EC4899', // Pink-500

  // Status colors with proper contrast
  success: '#059669', // Emerald-600
  warning: '#D97706', // Amber-600
  error: '#DC2626', // Red-600
  info: '#2563EB', // Blue-600

  // Neutral colors with proper contrast ratios
  neutral: {
    50: '#F8FAFC',   // Slate-50
    100: '#F1F5F9',  // Slate-100
    200: '#E2E8F0',  // Slate-200
    300: '#CBD5E1',  // Slate-300
    400: '#94A3B8',  // Slate-400
    500: '#64748B',  // Slate-500
    600: '#475569',  // Slate-600
    700: '#334155',  // Slate-700
    800: '#1E293B',  // Slate-800
    900: '#0F172A',  // Slate-900
  },

  // Text colors with proper contrast
  text: {
    primary: '#0F172A',    // Slate-900 - High contrast
    secondary: '#475569',  // Slate-600 - Good contrast
    tertiary: '#64748B',  // Slate-500 - Medium contrast
    inverse: '#FFFFFF',   // White for dark backgrounds
    muted: '#94A3B8',     // Slate-400 - Lower contrast for muted text
  },

  // Background colors
  background: {
    primary: '#FFFFFF',   // White
    secondary: '#F8FAFC', // Slate-50
    tertiary: '#F1F5F9',  // Slate-100
    dark: '#0F172A',      // Slate-900
  },

  // Border colors
  border: {
    light: '#E2E8F0',    // Slate-200
    medium: '#CBD5E1',   // Slate-300
    dark: '#94A3B8',     // Slate-400
  },

  gradient: {
    primary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    light: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    subtle: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
    glass: 'rgba(255, 255, 255, 0.95)',
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(0, 166, 251, 0.3)',
};

export const typography = {
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  lineHeights: {
    tight: '120%',
    normal: '150%',
    relaxed: '160%',
  }
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
