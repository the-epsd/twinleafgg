import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CardImagesProvider } from './context/CardImagesContext';
import { LanguageProvider } from './context/LanguageContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { SettingsProvider } from './context/SettingsContext';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GamesPage } from './pages/GamesPage';
import { DeckListPage } from './pages/DeckListPage';
import { DeckStatsPage } from './pages/DeckStatsPage';
import { DeckEditPage } from './pages/DeckEditPage';
import { RankingPage } from './pages/RankingPage';
import { MessagesPage } from './pages/MessagesPage';
import { BattlePassPage } from './pages/BattlePassPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { TablePage } from './pages/TablePage';
import { SpectatePage } from './pages/SpectatePage';

function ProfileMeRedirect() {
  const { user } = useAuth();
  return <Navigate to={`/profile/${user!.userId}`} replace />;
}

function ProfilePageRoute() {
  const { userId } = useParams();
  return <ProfilePage key={userId} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <SnackbarProvider>
      <AuthProvider>
        <SettingsProvider>
        <CardImagesProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/games" element={<GamesPage />} />
                <Route path="/spectate" element={<SpectatePage />} />
                <Route path="/table/replay/:matchId" element={<TablePage />} />
                <Route path="/table/:gameId" element={<TablePage />} />
                <Route path="/deck" element={<DeckListPage />} />
                <Route path="/deck/:deckId/stats" element={<DeckStatsPage />} />
                <Route path="/deck/:deckId" element={<DeckEditPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/message" element={<MessagesPage />} />
                <Route path="/message/:userId" element={<MessagesPage />} />
                <Route path="/battle-pass" element={<BattlePassPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfileMeRedirect />} />
                <Route path="/profile/:userId" element={<ProfilePageRoute />} />
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
