import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGE_CODES } from '../i18n/languages';
import { ApiError } from '../api/apiError';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { TwinleafCtaButton } from '../components/ui/TwinleafCtaButton';
import styles from './auth/AuthShell.module.css';

const SAVED_USERNAME_KEY = 'ptcg_login_saved_username';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated, ready } = useAuth();
  const { language, setLanguage, labels } = useLanguage();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/games';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUsername, setRememberUsername] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const languageItems = SUPPORTED_LANGUAGE_CODES.map((code) => ({
    id: code,
    label: labels[code],
    onSelect: () => setLanguage(code),
  }));
  const selectedLanguageLabel = labels[language];
  const selectedLanguageIndex = SUPPORTED_LANGUAGE_CODES.indexOf(language);

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
            <h1 className={styles.title}>{t('LOGIN_SIGN_IN')}</h1>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              {t('LOGIN_USERNAME')}
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className={styles.check}>
              <input
                type="checkbox"
                checked={rememberUsername}
                onChange={(e) => setRememberUsername(e.target.checked)}
              />
              {t('LOGIN_REMEMBER_USERNAME')}
            </label>

            <label className={styles.field}>
              {t('LOGIN_PASSWORD')}
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}

            <TwinleafCtaButton type="submit" fullWidth disabled={loading} className={styles.signInButton}>
              {loading ? t('REACT_SIGNING_IN') : t('LOGIN_SIGN_IN')}
            </TwinleafCtaButton>
          </form>

          <p className={`${styles.footer} ${styles.loginFooter}`}>
            <Link to="/register">{t('LOGIN_CREATE_ACCOUNT')}</Link>
          </p>

          <div className={styles.langRow}>
            <div className={styles.langSelector}>
              <DropdownMenu
                trigger={<span className={styles.langTriggerValue}>{selectedLanguageLabel}</span>}
                triggerClassName={styles.langTrigger}
                panelClassName={styles.langPanel}
                items={languageItems}
                defaultActiveIndex={selectedLanguageIndex >= 0 ? selectedLanguageIndex : 0}
                aria-label={t('LABEL_LANGUAGE')}
                placement="top-end"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
