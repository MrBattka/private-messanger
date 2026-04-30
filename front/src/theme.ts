export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#f8f9fa',
    text: '#212529',
    accent: '#28a745',
  },
  spacing: (factor: number) => `${factor * 0.5}rem`,
  borderRadius: '8px',
};

export type ThemeType = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  cardBg: string;
};

export const lightTheme: ThemeType = {
  background: '#ffffff',
  text: '#000000',
  primary: '#007bff',
  secondary: '#6c757d',
  border: '#dee2e6',
  cardBg: '#f8f9fa',
};

export const darkTheme: ThemeType = {
  background: '#121212',
  text: '#ffffff',
  primary: '#0d6efd',
  secondary: '#adb5bd',
  border: '#333333',
  cardBg: '#1e1e1e',
};
