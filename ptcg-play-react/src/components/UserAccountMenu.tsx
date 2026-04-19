import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { resolveAvatarUrl } from '../utils/avatarUrl';
import styles from './UserAccountMenu.module.css';

export function UserAccountMenu() {
  const { t } = useTranslation();
  const { user, serverConfig, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(e: MouseEvent | PointerEvent) {
      const el = wrapRef.current;
      if (el && !el.contains(e.target as Node)) {
        close();
      }
    }
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  if (!user) {
    return null;
  }

  const avatarSrc = resolveAvatarUrl(user.avatarFile, serverConfig);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        title={t('REACT_ACCOUNT_MENU_TRIGGER_TITLE')}
      >
        {avatarSrc ? (
          <img className={styles.avatar} src={avatarSrc} alt="" width={36} height={36} />
        ) : (
          <div className={styles.avatarPlaceholder} aria-hidden />
        )}
        <span className={styles.triggerMeta}>
          <span className={styles.triggerName}>{user.name}</span>
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>
      {open ? (
        <ul id={panelId} className={styles.panel} role="menu">
          <li className={styles.summary} role="presentation">
            <p className={styles.summaryRank}>
              {t('REACT_ACCOUNT_RANK_SUMMARY', {
                tier: user.rank,
                points: user.ranking,
              })}
            </p>
          </li>
          <li role="none">
            <Link
              role="menuitem"
              className={styles.item}
              to={`/profile/${user.userId}`}
              onClick={close}
            >
              {t('BUTTON_SHOW_PROFILE')}
            </Link>
          </li>
          <li role="none">
            <Link role="menuitem" className={styles.item} to="/settings" onClick={close}>
              {t('BUTTON_SETTINGS')}
            </Link>
          </li>
          <li className={styles.divider} role="presentation" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={`${styles.item} ${styles.itemDanger}`}
              onClick={() => {
                close();
                logout();
              }}
            >
              {t('BUTTON_LOGOUT')}
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
