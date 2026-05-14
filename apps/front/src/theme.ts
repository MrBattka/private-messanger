export type ThemeType = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    chatBackground: string;
    chatBackgroundWelcomeGradientStart: string,
    chatBackgroundWelcomeGradientEnd: string,
    chatItemBackground: string;
    chatItemActive: string;
    chatItemHover: string;
    chatItemBorder: string;
    chatText: string;
    backgroundGradientStart: string;
    backgroundGradientEnd: string;
    borderChat: string;
    textSecretMessenger: string;
    dropdownItem: string;
  };
  spacing: (factor: number) => string;
  borderRadius: string;
  border: string;
  cardBg: string;
};

export const lightTheme: ThemeType = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#000000',
    accent: '#28a745',
    chatBackground: '#ffffff',
    chatBackgroundWelcomeGradientStart: '#ffffff',
    chatBackgroundWelcomeGradientEnd: '#e4d3f8',
    chatItemBackground: '#f0f0f0',
    chatItemActive: '#e0f0ff',
    chatItemHover: '#d0e8ff',
    chatItemBorder: '#007bff',
    chatText: '#333333',
    backgroundGradientStart: '#f8f9ff',
    backgroundGradientEnd: '#f0f2ff',
    borderChat: '#e0e0e0',
    textSecretMessenger: '#7a6a8b',
    dropdownItem: '#d1d1d1',
  },
  spacing: (factor: number) => `${factor * 0.5}rem`,
  borderRadius: '8px',
  border: '#dee2e6',
  cardBg: '#f8f9fa',
};

export const darkTheme: ThemeType = {
  colors: {
    primary: '#0d6efd',
    secondary: '#adb5bd',
    background: '#414141e3',
    text: '#a1a1a1',
    accent: '#28a745',
    chatBackground: '#0c0125',
    chatBackgroundWelcomeGradientStart: '#969696',
    chatBackgroundWelcomeGradientEnd: '#584a68',
    chatItemBackground: '#333333',
    chatItemActive: '#3a5066',
    chatItemHover: '#405a70',
    chatItemBorder: '#0d6efd',
    chatText: '#e0e0e0',
    backgroundGradientStart: '#0c0125',
    backgroundGradientEnd: '#4e4e4e',
    borderChat: '#0c0125',
    textSecretMessenger: '#9c8eac',
    dropdownItem: '#747373',
  },
  spacing: (factor: number) => `${factor * 0.5}rem`,
  borderRadius: '8px',
  border: '#333333',
  cardBg: '#1e1e1e',
};