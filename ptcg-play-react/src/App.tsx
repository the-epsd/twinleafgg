import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from './routes';
import { AppProvider } from './context/AppContext';
import './i18n';
import MainMenu from './components/main-menu/MainMenu';
import { Login } from './components/login/Login';
import GamesComponent from './components/games/GamesComponent';
import './App.css';
import { DeckComponent } from './components/deck/DeckComponent';
import { DeckEditorComponent } from './components/deck/DeckEditorComponent';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const DeckEditorWrapper: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  return deckId ? <DeckEditorComponent deckId={Number(deckId)} /> : <Navigate to="/decks" />;
};

const App: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      if (elementRef.current) {
        const element = elementRef.current;
        const toolbarHeight = 64;
        const contentHeight = element.offsetHeight - toolbarHeight;
        const cardAspectRatio = 1.37;
        const padding = 32;
        const cardHeight = (contentHeight - (padding * 5)) / 7;
        let cardSize = Math.floor(cardHeight / cardAspectRatio);
        cardSize = Math.min(Math.max(cardSize, 60), 60);
        element.style.setProperty('--card-size', `${cardSize}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <AppProvider>
          <div ref={elementRef}>
            <CssBaseline />
            <Router>
              <div className="app-container">
                <MainMenu />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/decks" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/games" element={
                      <ProtectedRoute>
                        <GamesComponent />
                      </ProtectedRoute>
                    } />
                    <Route path="/decks" element={
                      <ProtectedRoute>
                        <DeckComponent />
                      </ProtectedRoute>
                    } />
                    <Route path="/decks/edit/:deckId" element={
                      <ProtectedRoute>
                        <DeckEditorWrapper />
                      </ProtectedRoute>
                    } />
                    <Route path="/table" element={
                      <ProtectedRoute>
                        <div>Table Component</div>
                      </ProtectedRoute>
                    } />
                    <Route path="/replays" element={
                      <ProtectedRoute>
                        <div>Replays Component</div>
                      </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <div>Messages Component</div>
                      </ProtectedRoute>
                    } />
                    <Route path="/terms" element={<div>Terms Component</div>} />
                  </Routes>
                </main>
              </div>
            </Router>
          </div>
        </AppProvider>
      </DndProvider>
    </ThemeProvider>
  );
};

export default App;
