import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CoreSessionProvider } from '../context/CoreSessionContext';
import { MessagesProvider } from '../context/MessagesContext';
import { LoadingSessionScreen } from '../pages/auth/LoadingSessionScreen';

export function ProtectedRoute() {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <LoadingSessionScreen />;
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
