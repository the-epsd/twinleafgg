import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnlinePlayersSidebar } from './OnlinePlayersSidebar';
import styles from './OnlinePlayersSidebarRail.module.css';

export function OnlinePlayersSidebarRail() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const railClass = collapsed ? styles.railCollapsed : styles.railExpanded;

  return (
    <div className={`${styles.rail} ${railClass}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? t('REACT_ONLINE_PLAYERS_EXPAND') : t('REACT_ONLINE_PLAYERS_COLLAPSE')}
      >
        {collapsed ? '‹' : '›'}
      </button>
      {!collapsed ? (
        <div className={styles.panel}>
          <OnlinePlayersSidebar appearance="sandbox" />
        </div>
      ) : null}
    </div>
  );
}
