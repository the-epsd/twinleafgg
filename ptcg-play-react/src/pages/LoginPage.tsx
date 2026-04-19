import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appConfig } from '../env/config';
import { ApiError } from '../api/apiError';
import { setPreferSessionOnly } from '../api/storage';

const SAVED_USERNAME_KEY = 'ptcg_login_saved_username';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated, ready, setApiUrlOverride } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/games';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [rememberUsername, setRememberUsername] = useState(true);
  const [rememberLogin, setRememberLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_USERNAME_KEY);
    if (saved) {
      setName(saved);
    }
  }, []);

  if (ready && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setApiUrlOverride(apiUrl.trim() || undefined);
      setPreferSessionOnly(!rememberLogin);
      await login(name.trim(), password);
      if (rememberUsername) {
        localStorage.setItem(SAVED_USERNAME_KEY, name.trim());
      } else {
        localStorage.removeItem(SAVED_USERNAME_KEY);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('REACT_ERROR_LOGIN_FAILED');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto', padding: 24 }}>
      <h1>{t('LOGIN_SIGN_IN')}</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          {t('REACT_OPTIONAL_API_URL')}
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder={appConfig.apiUrl}
            autoComplete="off"
            style={{ width: '100%', marginTop: 4 }}
          />
          <span style={{ display: 'block', fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            {t('REACT_REGISTER_API_HINT')}
          </span>
        </label>
        <label>
          {t('LOGIN_USERNAME')}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            required
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={rememberUsername}
            onChange={(e) => setRememberUsername(e.target.checked)}
          />{' '}
          {t('LOGIN_REMEMBER_USERNAME')}
        </label>
        <label>
          {t('LOGIN_PASSWORD')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={rememberLogin}
            onChange={(e) => setRememberLogin(e.target.checked)}
          />{' '}
          {t('REACT_REMEMBER_LOGIN')}
        </label>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? t('REACT_SIGNING_IN') : t('LOGIN_SIGN_IN')}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <Link to="/register">{t('LOGIN_CREATE_ACCOUNT')}</Link>
      </p>
    </div>
  );
}
