import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCoreSession } from '../context/CoreSessionContext';
import { SUPPORTED_LANGUAGE_CODES, type SupportedLanguageCode } from '../i18n/languages';
import { partitionMyGames } from '../games/myGamesClassify';
import { UserAccountMenu } from './UserAccountMenu';
import styles from './AppLayout.module.css';

function isDeckEditorPath(pathname: string): boolean {
  return /^\/deck\/[^/]+\/?$/.test(pathname);
}

function isTablePath(pathname: string): boolean {
  return (
    /^\/table\/replay\/[^/]+\/?$/.test(pathname) ||
    /^\/table\/saved-replay\/[^/]+\/?$/.test(pathname) ||
    /^\/table\/[^/]+\/?$/.test(pathname)
  );
}

function isParentMapPath(pathname: string): boolean {
  return pathname === '/parent' || pathname.startsWith('/parent/');
}

function isMyGamesPath(pathname: string): boolean {
  return pathname === '/my-games' || pathname.startsWith('/my-games/');
}

export function AppLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { language, setLanguage, labels } = useLanguage();
  const { user } = useAuth();
  const { games, clientId } = useCoreSession();
  const deckEditorFullBleed = isDeckEditorPath(pathname);
  const tableFullBleed = isTablePath(pathname);
  const parentMap = isParentMapPath(pathname);
  const myGamesBleed = isMyGamesPath(pathname);
  const mainBleed = deckEditorFullBleed || tableFullBleed || myGamesBleed;

  const incomingInviteCount = useMemo(() => {
    const { incoming } = partitionMyGames(games, clientId, user?.userId ?? 0);
    return incoming.length;
  }, [games, clientId, user?.userId]);

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
          <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/games">{t('MAIN_GAMES')}</Link>
            <Link to="/my-games" className={styles.navLinkWithBadge}>
              {t('MAIN_MY_GAMES')}
              {incomingInviteCount > 0 ? (
                <span className={styles.navBadge} aria-label={t('REACT_MY_GAMES_BADGE_ARIA', { count: incomingInviteCount })}>
                  {incomingInviteCount}
                </span>
              ) : null}
            </Link>
            <Link to="/spectate">{t('MAIN_SPECTATE')}</Link>
            <Link to="/replays">{t('MAIN_REPLAYS')}</Link>
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
          padding: mainBleed ? 0 : 20,
          flex: 1,
          minHeight: 0,
          overflowX: parentMap ? 'auto' : 'hidden',
          overflowY: tableFullBleed || myGamesBleed ? 'hidden' : parentMap ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
