import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSessionScreen } from '../pages/auth/LoadingSessionScreen';

export function AdminRoute() {
  const { user, ready, isAuthenticated } = useAuth();

  if (!ready) {
    return <LoadingSessionScreen />;
  }

  if (!isAuthenticated || user?.roleId !== 4) {
    return <Navigate to="/games" replace />;
  }

  return <Outlet />;
}
