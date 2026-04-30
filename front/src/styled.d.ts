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
    };
    spacing: (factor: number) => string;
    borderRadius: string;
  }
  export interface DefaultTheme extends ThemeType {}
}