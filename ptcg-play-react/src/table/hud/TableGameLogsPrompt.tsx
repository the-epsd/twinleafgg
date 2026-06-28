import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { GamePhase } from 'ptcg-server';
import type { Player, StateLog } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { ShellButton } from '../../components/ui/ShellButton';
import {
  formatGameLogLine,
  groupLogsByTurn,
  logPlayerName,
  logSpeakerClass,
  type GameLogSpeakerClass,
} from './gameLogUtils';
import { cn } from '../../utils/cn';
import styles from './TableGameLogsPrompt.module.css';

export type TableGameLogsPromptProps = {
  logs: StateLog[];
  localGame: LocalGameState;
  clientId: number;
  players: Player[];
  onClose: () => void;
  onSendChat: (message: string) => void;
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

export function TableGameLogsPrompt(props: TableGameLogsPromptProps) {
  const { t } = useTranslation();
  const { logs, localGame, clientId, players, onClose, onSendChat } = props;
  const [draft, setDraft] = useState('');

  const sections = groupLogsByTurn(logs, t, clientId);

  const activePlayerId =
    localGame.state.phase === GamePhase.PLAYER_TURN
      ? localGame.state.players[localGame.state.activePlayer]?.id
      : undefined;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const send = () => {
    const message = draft
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\x00-\x7F]/g, '');
    if (!message || localGame.deleted) {
      return;
    }
    onSendChat(message);
    setDraft('');
  };

  return createPortal(
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-game-logs-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="table-game-logs-title" className={styles.title}>
            {t('TABLE_LOGS')}
          </h2>
          <ShellButton type="button" variant="secondary" className={styles.closeBtn} onClick={onClose}>
            {t('BUTTON_CLOSE', { defaultValue: 'Close' })}
          </ShellButton>
        </div>

        <div className={styles.body}>
          {sections.length === 0 ? (
            <p className={styles.empty}>{t('REACT_NO_GAME_LOGS', { defaultValue: 'No log entries yet.' })}</p>
          ) : (
            sections.map((section) => (
              <section key={section.key} className={styles.section} aria-label={section.title}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <ul className={styles.list}>
                  {section.logs.map((log, logIndex) => {
                    const name = logPlayerName(log, players);
                    const speaker = logSpeakerClass(log, activePlayerId);
                    const line = formatGameLogLine(t, log);
                    const ts = log.params?.timestamp != null ? String(log.params.timestamp) : '';
                    return (
                      <li key={`${log.id}-${logIndex}`} className={styles.row}>
                        {ts ? <span className={styles.ts}>[{ts}]</span> : null}
                        <span className={cn(styles.name, speakerClassName(speaker))}>{name}:</span>
                        <span>{line}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

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
            className={styles.sendBtn}
            disabled={!!localGame.deleted || !draft.trim()}
            onClick={send}
          >
            {t('MESSAGES_SEND_MESSAGE')}
          </ShellButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
