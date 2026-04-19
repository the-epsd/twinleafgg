import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { appConfig } from '../env/config';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/apiError';

export function RegisterPage() {
  const { t } = useTranslation();
  const { register, setApiUrlOverride } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverPassword, setServerPassword] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setApiUrlOverride(apiUrl.trim() || undefined);
      await register(name.trim(), password, email.trim(), serverPassword.trim() || undefined);
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('REACT_ERROR_REGISTER_FAILED');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto', padding: 24 }}>
      <h1>{t('REGISTER_TITLE')}</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          {t('REACT_OPTIONAL_API_URL')}
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder={appConfig.apiUrl}
            style={{ width: '100%', marginTop: 4 }}
          />
          <span style={{ display: 'block', fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            {t('REACT_REGISTER_API_HINT')}
          </span>
        </label>
        <label>
          {t('REGISTER_NAME')}
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label>
          {t('LABEL_EMAIL')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <label>
          {t('REGISTER_PASSWORD')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <label>
          {t('REACT_REGISTER_SERVER_PASSWORD')}
          <input
            type="password"
            value={serverPassword}
            onChange={(e) => setServerPassword(e.target.value)}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? t('REACT_SUBMITTING') : t('REGISTER_BUTTON')}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <Link to="/login">{t('REACT_BACK_TO_LOGIN')}</Link>
      </p>
    </div>
  );
}
