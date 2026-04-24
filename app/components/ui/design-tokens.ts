// Design System Constants - Single Source of Truth (DRY)
export const DESIGN_TOKENS = {
  colors: {
    // Primary Palette
    deepPersianBlue: '#102444',
    deepBlueDark: '#0A1626',
    deepBlueMedium: '#1A3050',
    
    // Interactive
    turquoise: '#4DBABA',
    turquoiseLight: '#6DD4D4',
    turquoiseDark: '#3A9999',
    cyanBright: '#00D9FF',
    
    // Accent
    gold: '#FFC107',
    goldLight: '#FFD54F',
    
    // Backgrounds
    bgDark: '#0F1419',
    bgDarkSecondary: '#1A1F26',
    bgCard: '#252D38',
    bgCardHover: '#2D3642',
    
    // Surfaces
    surfaceDark: '#1E2530',
    surfaceMedium: '#2A3340',
    surfaceLight: '#E8F4F8',
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#B8C7DC',
    textTertiary: '#7393C2',
    textOnLight: '#102444',
    
    // Borders
    borderSubtle: 'rgba(77, 186, 186, 0.2)',
    borderTurquoise: '#4DBABA',
    borderGold: '#FFC107',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '80px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
    '5xl': '64px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(77, 186, 186, 0.3)',
  },
  
  transitions: {
    fast: '0.1s ease',
    base: '0.2s ease',
    slow: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
