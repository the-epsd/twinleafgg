import { useTranslation } from 'react-i18next';
import { GamePhase } from 'ptcg-server';
import type { Player } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { TablePlayerBar } from './TablePlayerBar';
import { TablePlayerActions } from './TablePlayerActions';
import { TableReplayControls } from './TableReplayControls';
import styles from './TableBoardOverlay.module.css';

export type TableBoardOverlayProps = {
  localGame: LocalGameState;
  clientId: number;
  topPlayer: Player;
  bottomPlayer: Player;
  isPlaying: boolean;
  isObserver: boolean;
  onPassTurn: () => void;
  onLeave: () => void;
  onSwitchSides: () => void;
  onSendChat: (message: string) => void;
  onReplayStep: (position: number, state: LocalGameState['state'], logs: LocalGameState['logs']) => void;
  /** Averaged WebGL board frame rate from the 3D canvas (null until first sample). */
  boardFps: number | null;
};

export function TableBoardOverlay(props: TableBoardOverlayProps) {
  const { t } = useTranslation();
  const {
    localGame,
    clientId,
    topPlayer,
    bottomPlayer,
    isPlaying,
    isObserver,
    onPassTurn,
    onLeave,
    onSwitchSides,
    onReplayStep,
    boardFps,
  } = props;

  const state = localGame.state;
  const active = state.players[state.activePlayer];
  const topActive = !!active && active.id === topPlayer.id && state.phase === GamePhase.PLAYER_TURN;
  const bottomActive = !!active && active.id === bottomPlayer.id && state.phase === GamePhase.PLAYER_TURN;

  const topStats = localGame.playerStats?.find((s) => s.clientId === topPlayer.id);
  const bottomStats = localGame.playerStats?.find((s) => s.clientId === bottomPlayer.id);
  const timeLimit = localGame.timeLimit ?? 0;

  const showReplay = !!localGame.replay;

  return (
    <div className={styles.root}>
      <div className={styles.opponentBar}>
        <TablePlayerBar
          player={topPlayer}
          isActive={topActive}
          playerStats={topStats}
          timeLimit={timeLimit}
          compact
        />
      </div>

      <div className={styles.selfBar}>
        <TablePlayerBar
          player={bottomPlayer}
          isActive={bottomActive}
          playerStats={bottomStats}
          timeLimit={timeLimit}
          compact
        />
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.turnBadgeGroup}>
          <div className={styles.turnBadge}>
            {t('TABLE_TABLE_NAME', { id: localGame.gameId })} —{' '}
            {t('TABLE_TURN_NUMBER', { turn: state.turn })}
          </div>
          <div className={styles.boardFpsLine} aria-live="polite">
            {boardFps != null ? t('TABLE_BOARD_FPS', { fps: boardFps }) : t('TABLE_BOARD_FPS_MEASURING')}
          </div>
        </div>
        {showReplay && localGame.replay ? (
          <TableReplayControls localGame={localGame} replay={localGame.replay} onStep={onReplayStep} />
        ) : null}
      </div>

      <div className={styles.actionsRow}>
        <TablePlayerActions
          localGame={localGame}
          clientId={clientId}
          isPlaying={isPlaying}
          isObserver={isObserver}
          onPassTurn={onPassTurn}
          onLeave={onLeave}
          onSwitchSides={onSwitchSides}
        />
      </div>
    </div>
  );
}
