import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGE_CODES, type SupportedLanguageCode } from '../i18n/languages';
import { UserAccountMenu } from './UserAccountMenu';

function isDeckEditorPath(pathname: string): boolean {
  return /^\/deck\/[^/]+\/?$/.test(pathname);
}

function isTablePath(pathname: string): boolean {
  return /^\/table\/replay\/[^/]+\/?$/.test(pathname) || /^\/table\/[^/]+\/?$/.test(pathname);
}

function isParentMapPath(pathname: string): boolean {
  return pathname === '/parent' || pathname.startsWith('/parent/');
}

export function AppLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { language, setLanguage, labels } = useLanguage();
  const deckEditorFullBleed = isDeckEditorPath(pathname);
  const tableFullBleed = isTablePath(pathname);
  const parentMap = isParentMapPath(pathname);

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
      {!tableFullBleed && (
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
            <Link to="/spectate">{t('MAIN_SPECTATE')}</Link>
            <Link to="/deck">{t('DECK_TITLE')}</Link>
            <Link to="/ranking">{t('MAIN_RANKING')}</Link>
            <Link to="/friends">{t('MAIN_FRIENDS')}</Link>
            <Link to="/message">{t('MAIN_MESSAGES')}</Link>
            <Link to="/battle-pass">{t('MAIN_BATTLE_PASS')}</Link>
            <Link to="/parent">Parents</Link>
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
          <UserAccountMenu />
        </header>
      )}
      <main
        style={{
          padding: deckEditorFullBleed || tableFullBleed ? 0 : 20,
          flex: 1,
          minHeight: 0,
          overflowX: parentMap ? 'auto' : 'hidden',
          overflowY: tableFullBleed ? 'hidden' : parentMap ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
