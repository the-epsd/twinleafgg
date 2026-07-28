import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchLoginInfo } from '../api/authApi';
import { ApiError, formatRegisterError } from '../api/apiError';
import { TwinleafCtaButton } from '../components/ui/TwinleafCtaButton';
import styles from './auth/AuthShell.module.css';

export function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverPassword, setServerPassword] = useState('');
  const [serverPasswordRequired, setServerPasswordRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchLoginInfo()
      .then((config) => {
        if (!cancelled) {
          setServerPasswordRequired(Boolean(config.serverPasswordRequired));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setServerPasswordRequired(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(
        name.trim(),
        password,
        email.trim(),
        serverPasswordRequired ? serverPassword.trim() || undefined : undefined,
      );
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const msg =
        err instanceof ApiError ? formatRegisterError(err, t) : t('REACT_ERROR_REGISTER_FAILED');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />
      <div className={styles.dots} aria-hidden />

      <div className={styles.panel}>
        <div className={styles.sunburstClip} aria-hidden>
          <div className={styles.sunburst} />
        </div>
        <div className={styles.inner}>
          <div className={styles.logoWrap}>
            <img className={styles.logo} src="/tl-open-beta-sm.webp" alt="" />
            <h1 className={styles.title}>{t('REGISTER_TITLE')}</h1>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              {t('REGISTER_NAME')}
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className={styles.field}>
              {t('LABEL_EMAIL')}
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className={styles.field}>
              {t('REGISTER_PASSWORD')}
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>

            {serverPasswordRequired ? (
              <label className={styles.field}>
                {t('REACT_REGISTER_SERVER_PASSWORD')}
                <input
                  className={styles.input}
                  type="password"
                  value={serverPassword}
                  onChange={(e) => setServerPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
              </label>
            ) : null}

            {error ? <p className={styles.error}>{error}</p> : null}

            <TwinleafCtaButton type="submit" variant="gold" fullWidth disabled={loading}>
              {loading ? t('REACT_SUBMITTING') : t('REGISTER_BUTTON')}
            </TwinleafCtaButton>
          </form>

          <p className={styles.footer}>
            <Link to="/login">{t('REACT_BACK_TO_LOGIN')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
