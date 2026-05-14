import 'styled-components';
import { ThemeType } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
      chatBackground: string;
      chatBackgroundWelcomeGradientStart: string;
      chatBackgroundWelcomeGradientEnd: string;
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
  }
  export interface DefaultTheme extends ThemeType { }
}