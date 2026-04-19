import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CoreSessionProvider } from '../context/CoreSessionContext';
import { MessagesProvider } from '../context/MessagesContext';

export function ProtectedRoute() {
  const { t } = useTranslation();
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div style={{ padding: 24 }}>{t('PROTECTED_LOADING_SESSION')}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <CoreSessionProvider>
      <MessagesProvider>
        <Outlet />
      </MessagesProvider>
    </CoreSessionProvider>
  );
}
