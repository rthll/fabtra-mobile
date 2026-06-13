/**
 * Modern Design System for ValidadorPasses
 * Updated with contemporary colors, gradients, and spacing
 */

import { Platform } from 'react-native';

// Primary Colors - Modern Palette
const PRIMARY = '#0066ff';      // Vibrant Blue
const SUCCESS = '#1fad5d';      // Fresh Green
const ERROR = '#ff4757';        // Modern Red
const WARNING = '#ffa502';      // Orange
const INFO = '#00a8ff';         // Cyan

// Neutral Colors - Gray Scale
const NEUTRAL = {
  950: '#0f0f0f',
  900: '#1a1a1a',
  800: '#2d2d2d',
  700: '#3d3d3d',
  600: '#515151',
  500: '#6b6b6b',
  400: '#86888a',
  300: '#a0a0a0',
  200: '#d1d5db',
  100: '#e5e7eb',
  50: '#f5f6f7',
};

export const Colors = {
  light: {
    // Text & Content
    text: '#0f0f0f',
    textSecondary: '#6b6b6b',
    textTertiary: '#a0a0a0',
    background: '#ffffff',
    backgroundSecondary: '#f5f6f7',
    
    // Brand Colors
    primary: PRIMARY,
    primaryLight: '#e6f0ff',
    success: SUCCESS,
    successLight: '#ecf9f3',
    error: ERROR,
    errorLight: '#ffe8eb',
    warning: WARNING,
    warningLight: '#fef3e6',
    info: INFO,
    infoLight: '#e6f7ff',
    
    // UI Elements
    border: '#e5e7eb',
    borderStrong: '#d1d5db',
    tint: PRIMARY,
    icon: '#6b6b6b',
    tabIconDefault: '#a0a0a0',
    tabIconSelected: PRIMARY,
    
    // Shadows & Overlays
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  dark: {
    // Text & Content
    text: '#f5f6f7',
    textSecondary: '#a0a0a0',
    textTertiary: '#6b6b6b',
    background: '#0f0f0f',
    backgroundSecondary: '#1a1a1a',
    
    // Brand Colors
    primary: '#4db8ff',
    primaryLight: '#1a3a5c',
    success: '#2dd77a',
    successLight: '#0d3d25',
    error: '#ff7a8a',
    errorLight: '#4d1f26',
    warning: '#ffb84d',
    warningLight: '#4d3d1a',
    info: '#4dd9ff',
    infoLight: '#0d3d4d',
    
    // UI Elements
    border: '#3d3d3d',
    borderStrong: '#515151',
    tint: '#4db8ff',
    icon: '#a0a0a0',
    tabIconDefault: '#6b6b6b',
    tabIconSelected: '#4db8ff',
    
    // Shadows & Overlays
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Gradients
  gradients: {
    primary: ['#0066ff', '#0066ff'], // Solid primary
    success: ['#1fad5d', '#13b34a'],
    error: ['#ff4757', '#ff3838'],
    warning: ['#ffa502', '#ff8c00'],
    sunset: ['#ff6b6b', '#ffa502'],
    ocean: ['#0066ff', '#00a8ff'],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
