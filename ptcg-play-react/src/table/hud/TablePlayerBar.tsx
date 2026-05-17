import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/strings';
import type { Player, PlayerStats } from 'ptcg-server';
import { cn } from '../../utils/cn';
import styles from './TablePlayerBar.module.css';

export type TablePlayerBarProps = {
  player: Player;
  isActive: boolean;
  playerStats?: PlayerStats;
  timeLimit: number;
  className?: string;
  /** Denser layout for table HUD. */
  compact?: boolean;
};

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function TablePlayerBar(props: TablePlayerBarProps) {
  const { t } = useTranslation();
  const { player, isActive, playerStats, timeLimit, className, compact } = props;
  const showTimer =
    timeLimit > 0 &&
    playerStats &&
    playerStats.clientId === player.id &&
    playerStats.isTimeRunning;

  /** Anchor local countdown to last server `timeLeft`; resync only when that value changes. */
  const timerAnchorRef = useRef<{ left: number; atMs: number }>({ left: 0, atMs: Date.now() });
  const lastServerTimeLeftRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showTimer || !playerStats) {
      lastServerTimeLeftRef.current = null;
      return;
    }
    if (lastServerTimeLeftRef.current !== playerStats.timeLeft) {
      lastServerTimeLeftRef.current = playerStats.timeLeft;
      timerAnchorRef.current = { left: playerStats.timeLeft, atMs: Date.now() };
    }
  }, [showTimer, playerStats]);

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!showTimer) {
      return;
    }
    const id = window.setInterval(() => setTick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [showTimer]);

  const liveSeconds =
    showTimer && playerStats
      ? Math.max(
          0,
          timerAnchorRef.current.left -
            Math.floor((Date.now() - timerAnchorRef.current.atMs) / 1000),
        )
      : 0;

  const timeStr = showTimer ? formatClock(liveSeconds) : '';

  return (
    <div
      className={cn(styles.root, compact && styles.rootCompact, isActive && styles.rootActive, className)}
      data-active={isActive || undefined}
    >
      <h4 className={styles.name}>{player.name || '—'}</h4>
      <div className={styles.badges}>
        <span className={styles.badge}>{t('TABLE_DECK_COUNT', { count: player.deck?.cards?.length ?? 0 })}</span>
        <span className={styles.badge}>{t('TABLE_HAND_COUNT', { count: player.hand?.cards?.length ?? 0 })}</span>
        <span className={styles.badge}>{t('TABLE_DISCARD_COUNT', { count: player.discard?.cards?.length ?? 0 })}</span>
        <span className={styles.badge}>{t('TABLE_LOSTZONE_COUNT', { count: player.lostzone?.cards?.length ?? 0 })}</span>
      </div>
      {showTimer ? <div className={styles.timer}>{timeStr}</div> : null}
    </div>
  );
}
