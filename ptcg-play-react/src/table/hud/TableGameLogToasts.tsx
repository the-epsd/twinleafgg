import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GamePhase } from 'ptcg-server';
import type { Player, StateLog } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import {
  formatGameLogLine,
  isLogHidden,
  logPlayerName,
  logSpeakerClass,
  type GameLogSpeakerClass,
} from './gameLogUtils';
import { cn } from '../../utils/cn';
import styles from './TableGameLogToasts.module.css';

const MAX_VISIBLE = 3;
const VISIBLE_MS = 4000;
const EXIT_MS = 480;

type ToastItem = {
  log: StateLog;
  phase: 'visible' | 'exiting';
  shownAt: number;
};

type PendingExit = {
  logId: number;
  shownAt: number;
};

export type TableGameLogToastsProps = {
  localGame: LocalGameState;
  clientId: number;
  players: Player[];
};

function speakerClassName(kind: GameLogSpeakerClass): string | undefined {
  switch (kind) {
    case 'system':
      return styles.nameSystem;
    case 'active':
      return styles.nameActive;
    case 'opponent':
      return styles.nameOpponent;
    default:
      return undefined;
  }
}

function delay(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function TableGameLogToasts(props: TableGameLogToastsProps) {
  const { t } = useTranslation();
  const { localGame, clientId, players } = props;
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const displayedIdsRef = useRef<Set<number>>(new Set());
  const pendingLogsRef = useRef<StateLog[]>([]);
  const pendingExitsRef = useRef<PendingExit[]>([]);
  const schedulerRunningRef = useRef(false);
  const schedulerGenRef = useRef(0);
  const gameKeyRef = useRef(localGame.localId);
  const flushPendingRef = useRef<() => void>(() => {});
  const runExitSchedulerRef = useRef<() => void>(() => {});

  const activePlayerId =
    localGame.state.phase === GamePhase.PLAYER_TURN
      ? localGame.state.players[localGame.state.activePlayer]?.id
      : undefined;

  const cancelPendingExit = (logId: number) => {
    pendingExitsRef.current = pendingExitsRef.current.filter((item) => item.logId !== logId);
  };

  const flushPendingLogs = () => {
    let shouldSchedule = false;
    setToasts((prev) => {
      if (pendingLogsRef.current.length === 0) {
        return prev;
      }

      let next = [...prev];
      let changed = false;

      while (pendingLogsRef.current.length > 0 && next.length < MAX_VISIBLE) {
        const log = pendingLogsRef.current.shift();
        if (!log) {
          break;
        }
        const shownAt = Date.now();
        next.push({ log, phase: 'visible', shownAt });
        pendingExitsRef.current.push({ logId: log.id, shownAt });
        changed = true;
      }

      if (changed) {
        shouldSchedule = true;
      }
      return changed ? next : prev;
    });
    if (shouldSchedule) {
      runExitSchedulerRef.current();
    }
  };

  flushPendingRef.current = flushPendingLogs;

  const runExitScheduler = () => {
    if (schedulerRunningRef.current) {
      return;
    }
    schedulerRunningRef.current = true;
    const generation = ++schedulerGenRef.current;

    void (async () => {
      while (pendingExitsRef.current.length > 0) {
        if (generation !== schedulerGenRef.current) {
          break;
        }

        pendingExitsRef.current.sort((a, b) => {
          const exitDiff = a.shownAt - b.shownAt;
          if (exitDiff !== 0) {
            return exitDiff;
          }
          return a.logId - b.logId;
        });

        const next = pendingExitsRef.current[0];
        if (!next) {
          break;
        }

        const exitAt = next.shownAt + VISIBLE_MS;
        await delay(Math.max(0, exitAt - Date.now()));
        if (generation !== schedulerGenRef.current) {
          break;
        }

        if (pendingExitsRef.current[0]?.logId !== next.logId) {
          continue;
        }
        pendingExitsRef.current.shift();

        setToasts((prev) =>
          prev.some((item) => item.log.id === next.logId)
            ? prev.map((item) => (item.log.id === next.logId ? { ...item, phase: 'exiting' } : item))
            : prev,
        );

        await delay(EXIT_MS);
        if (generation !== schedulerGenRef.current) {
          break;
        }

        setToasts((prev) => prev.filter((item) => item.log.id !== next.logId));
        flushPendingRef.current();
      }

      schedulerRunningRef.current = false;
      if (pendingExitsRef.current.length > 0 && generation === schedulerGenRef.current) {
        runExitScheduler();
      }
    })();
  };

  runExitSchedulerRef.current = runExitScheduler;

  const resetScheduler = () => {
    schedulerGenRef.current += 1;
    pendingExitsRef.current = [];
    pendingLogsRef.current = [];
    schedulerRunningRef.current = false;
  };

  useEffect(() => {
    return () => {
      resetScheduler();
    };
  }, []);

  useEffect(() => {
    if (gameKeyRef.current !== localGame.localId) {
      gameKeyRef.current = localGame.localId;
      displayedIdsRef.current.clear();
      resetScheduler();
      setToasts([]);
    }
  }, [localGame.localId]);

  useEffect(() => {
    const maxLogId = localGame.logs.reduce((max, log) => Math.max(max, log.id), 0);

    pendingLogsRef.current = pendingLogsRef.current.filter((log) => log.id <= maxLogId);

    setToasts((prev) => {
      const removed = prev.filter((item) => item.log.id > maxLogId);
      for (const item of removed) {
        cancelPendingExit(item.log.id);
      }
      const next = prev.filter((item) => item.log.id <= maxLogId);
      for (const id of displayedIdsRef.current) {
        if (id > maxLogId) {
          displayedIdsRef.current.delete(id);
        }
      }
      return next.length === prev.length ? prev : next;
    });

    const newLogs = localGame.logs.filter(
      (log) => log.id <= maxLogId && !displayedIdsRef.current.has(log.id) && !isLogHidden(log, clientId),
    );
    if (newLogs.length === 0) {
      flushPendingLogs();
      return;
    }

    for (const log of newLogs) {
      displayedIdsRef.current.add(log.id);
      pendingLogsRef.current.push(log);
    }

    flushPendingLogs();
  }, [clientId, localGame.logs]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.root} aria-live="polite" aria-relevant="additions">
      {toasts.map((item) => {
        const name = logPlayerName(item.log, players);
        const speaker = logSpeakerClass(item.log, activePlayerId);
        return (
          <div
            key={item.log.id}
            className={cn(styles.toast, item.phase === 'exiting' && styles.toastExiting)}
          >
            <span className={cn(styles.name, speakerClassName(speaker))}>{name}</span>
            <span className={styles.message}>{formatGameLogLine(t, item.log)}</span>
          </div>
        );
      })}
    </div>
  );
}
