import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { LanguageProvider } from './contexts/LanguageContext';
import MapScreen from './screens/MapScreen';
import ListingDetail from './screens/ListingDetail';
import ListingForm from './screens/ListingForm';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapScreen />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/create" element={<ListingForm />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

