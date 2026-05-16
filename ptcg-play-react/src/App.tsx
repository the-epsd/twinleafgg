import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CardImagesProvider } from './context/CardImagesContext';
import { LanguageProvider } from './context/LanguageContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { SettingsProvider } from './context/SettingsContext';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { GamesPage } from './pages/GamesPage';
import { DeckListPage } from './pages/DeckListPage';
import { DeckStatsPage } from './pages/DeckStatsPage';
import { DeckEditPage } from './pages/DeckEditPage';
import { SettingsPage } from './pages/SettingsPage';
import { TablePage } from './pages/TablePage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <SnackbarProvider>
      <AuthProvider>
        <SettingsProvider>
        <CardImagesProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/games" element={<GamesPage />} />
                <Route path="/table/replay/:matchId" element={<TablePage />} />
                <Route path="/table/:gameId" element={<TablePage />} />
                <Route path="/deck" element={<DeckListPage />} />
                <Route path="/deck/:deckId/stats" element={<DeckStatsPage />} />
                <Route path="/deck/:deckId" element={<DeckEditPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/games" replace />} />
            <Route path="*" element={<Navigate to="/games" replace />} />
          </Routes>
        </CardImagesProvider>
        </SettingsProvider>
      </AuthProvider>
      </SnackbarProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
