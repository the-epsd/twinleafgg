import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserInfo } from 'ptcg-server';
import { useAuth } from '../context/AuthContext';
import { useCoreSession } from '../context/CoreSessionContext';
import { resolveAvatarUrl } from '../utils/avatarUrl';
import styles from './OnlinePlayersSidebar.module.css';

const MAX_ROWS = 20;

export function OnlinePlayersSidebar() {
  const { t } = useTranslation();
  const { user, serverConfig } = useAuth();
  const { clients, usersById } = useCoreSession();

  const rows = useMemo(() => {
    const list: UserInfo[] = [];
    for (const c of clients) {
      const u = usersById[c.userId];
      if (u) {
        list.push(u);
      }
    }
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list.slice(0, MAX_ROWS);
  }, [clients, usersById]);

  return (
    <aside className={styles.aside} aria-label={t('REACT_ONLINE_PLAYERS_TITLE')}>
      <div className={styles.header}>
        <span>{t('REACT_ONLINE_PLAYERS_TITLE')}</span>
        <span className={styles.count}>({clients.length})</span>
      </div>
      {rows.length === 0 ? (
        <p className={styles.empty}>{t('REACT_ONLINE_PLAYERS_EMPTY')}</p>
      ) : (
        <ul className={styles.list}>
          {rows.map((u) => {
            const src = resolveAvatarUrl(u.avatarFile, serverConfig);
            const isSelf = user?.userId === u.userId;
            return (
              <li key={u.userId} className={`${styles.row} ${isSelf ? styles.rowSelf : ''}`}>
                <div className={styles.avatarWrap}>
                  {src ? (
                    <img className={styles.avatar} src={src} alt="" />
                  ) : (
                    <div className={styles.avatar} aria-hidden />
                  )}
                  <span className={styles.dot} title="Online" />
                </div>
                <div className={styles.meta}>
                  <span className={styles.name}>
                    {u.name}
                    {isSelf ? <span className={styles.you}>{t('REACT_ONLINE_PLAYERS_YOU')}</span> : null}
                  </span>
                  <span className={styles.rank}>{t('REACT_ONLINE_PLAYERS_RANK', { rank: u.ranking })}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
