import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.secondary};
    border-radius: 4px;
    border: 2px solid ${(props) => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.colors.primary} ${(props) => props.theme.colors.background};
  }

  body {
    margin: 0;
    padding: 0;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    transition: background-color 0.3s, color 0.3s; /* плавная смена */
  }

  * {
    box-sizing: border-box;
  }

  #root, html {
    height: 100%;
  }
`;

export default GlobalStyle;