import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CoreSessionProvider } from '../context/CoreSessionContext';

export function ProtectedRoute() {
  const { t } = useTranslation();
  const { ready } = useAuth();

  if (!ready) {
    return <div style={{ padding: 24 }}>{t('PROTECTED_LOADING_SESSION')}</div>;
  }

  return (
    <CoreSessionProvider>
      <Outlet />
    </CoreSessionProvider>
  );
}
