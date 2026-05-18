import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StateLog } from 'ptcg-server';
import type { Player } from 'ptcg-server';
import { GamePhase } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import styles from './TableGameLogPanel.module.css';

export type TableGameLogPanelProps = {
  localGame: LocalGameState;
  clientId: number;
  players: Player[];
  onSendChat: (message: string) => void;
  /** When set, collapse state is controlled by the parent (e.g. to shrink the HUD column). */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

function logPlayerName(log: StateLog, players: Player[]): string {
  if (log.client === 0) {
    return 'System';
  }
  return players.find((p) => p.id === log.client)?.name ?? `Player ${log.client}`;
}

function isLogHidden(log: StateLog, clientId: number): boolean {
  return String(log.params?.private) === 'true' && log.client !== clientId && log.client !== 0;
}

export function TableGameLogPanel(props: TableGameLogPanelProps) {
  const { t } = useTranslation();
  const { localGame, clientId, players, onSendChat, collapsed: collapsedProp, onCollapsedChange } = props;
  const [draft, setDraft] = useState('');
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const setCollapsed = (next: boolean) => {
    onCollapsedChange?.(next);
    if (collapsedProp === undefined) {
      setInternalCollapsed(next);
    }
  };
  const listRef = useRef<HTMLUListElement>(null);
  /** When true, new log lines snap the list to the bottom; scrolling up clears this. */
  const stickToBottomRef = useRef(true);

  const activeId =
    localGame.state.phase === GamePhase.PLAYER_TURN
      ? localGame.state.players[localGame.state.activePlayer]?.id
      : undefined;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const thresholdPx = 56;
    const updateStick = () => {
      stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= thresholdPx;
    };
    updateStick();
    el.addEventListener('scroll', updateStick, { passive: true });
    return () => el.removeEventListener('scroll', updateStick);
  }, [collapsed]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el || collapsed) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [localGame.logs.length, collapsed]);

  const send = () => {
    const message = draft
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\x00-\x7F]/g, '');
    if (!message || localGame.deleted) {
      return;
    }
    stickToBottomRef.current = true;
    onSendChat(message);
    setDraft('');
  };

  return (
    <div className={cn(styles.root, collapsed && styles.rootCollapsed)}>
      <div className={styles.collapseBar}>
        <button
          type="button"
          className={styles.collapseBtn}
          aria-expanded={!collapsed}
          aria-controls="table-game-log-panel-body"
          title={
            collapsed
              ? t('REACT_SHOW_MESSAGES', { defaultValue: 'Show messages' })
              : t('REACT_HIDE_MESSAGES', { defaultValue: 'Hide messages' })
          }
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className={cn(styles.chevron, collapsed && styles.chevronExpanded)} aria-hidden>
            {'\u25BC'}
          </span>
        </button>
      </div>

      {collapsed ? (
        <p className={styles.collapsedTitle}>{t('TABLE_LOGS')}</p>
      ) : (
        <div id="table-game-log-panel-body" className={styles.panelBody}>
          <h4 className={styles.header}>{t('TABLE_LOGS')}</h4>
          <ul ref={listRef} className={styles.list} aria-label={t('TABLE_LOGS')}>
            {localGame.logs.map((log) => {
              if (isLogHidden(log, clientId)) {
                return null;
              }
              const name = logPlayerName(log, players);
              const isActiveSpeaker = log.client !== 0 && log.client === activeId;
              const line = t(`GAME_LOGS.${log.message}`, {
                ...log.params,
                defaultValue: String(log.message),
              });
              const ts = log.params?.timestamp != null ? String(log.params.timestamp) : '';
              return (
                <li key={log.id} className={styles.row}>
                  {ts ? <span className={styles.ts}>[{ts}]</span> : null}
                  <span
                    className={cn(
                      styles.name,
                      name === 'System' && styles.nameSystem,
                      isActiveSpeaker && styles.nameActive,
                    )}
                  >
                    {name}:
                  </span>
                  <span>{line}</span>
                </li>
              );
            })}
          </ul>
          <div className={styles.footer}>
            <textarea
              className={styles.input}
              rows={2}
              maxLength={256}
              autoComplete="off"
              placeholder={t('MESSAGES_ENTER_MESSAGE')}
              value={draft}
              disabled={!!localGame.deleted}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <ShellButton
              type="button"
              className={styles.compactSend}
              disabled={!!localGame.deleted || !draft.trim()}
              onClick={send}
            >
              {t('MESSAGES_SEND_MESSAGE')}
            </ShellButton>
          </div>
        </div>
      )}
    </div>
  );
}
