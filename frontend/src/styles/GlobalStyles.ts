import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  #root {
    height: 100%;
    width: 100%;
  }

  /* Safe area insets for mobile */
  @supports (padding: max(0px)) {
    body {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }

  /* Smooth scrolling */
  * {
    -webkit-overflow-scrolling: touch;
  }

  /* Touch targets - minimum 48px */
  button, a {
    min-height: 48px;
    min-width: 48px;
  }
`;

export default GlobalStyles;

