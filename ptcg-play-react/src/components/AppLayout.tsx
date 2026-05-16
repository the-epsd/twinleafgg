import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGE_CODES, type SupportedLanguageCode } from '../i18n/languages';

function isDeckEditorPath(pathname: string): boolean {
  return /^\/deck\/[^/]+\/?$/.test(pathname);
}

function isTablePath(pathname: string): boolean {
  return /^\/table\/replay\/[^/]+\/?$/.test(pathname) || /^\/table\/[^/]+\/?$/.test(pathname);
}

export function AppLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { language, setLanguage, labels } = useLanguage();
  const deckEditorFullBleed = isDeckEditorPath(pathname);
  const tableFullBleed = isTablePath(pathname);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid #ccc',
          flexShrink: 0,
        }}
      >
        <strong>{t('REACT_SHELL_TITLE')}</strong>
        <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/games">{t('MAIN_GAMES')}</Link>
          <Link to="/deck">{t('DECK_TITLE')}</Link>
          <Link to="/settings">{t('BUTTON_SETTINGS')}</Link>
        </nav>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguageCode)}
            aria-label={t('LABEL_LANGUAGE')}
            title={t('LABEL_LANGUAGE')}
          >
            {SUPPORTED_LANGUAGE_CODES.map((code) => (
              <option key={code} value={code}>
                {labels[code]}
              </option>
            ))}
          </select>
        </label>
      </header>
      <main
        style={{
          padding: deckEditorFullBleed || tableFullBleed ? 0 : 20,
          flex: 1,
          minHeight: 0,
          overflowX: 'hidden',
          overflowY: tableFullBleed ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
