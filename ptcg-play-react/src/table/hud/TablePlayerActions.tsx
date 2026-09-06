import { useTranslation } from 'react-i18next';
import { GamePhase } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { useAuth } from '../../context/AuthContext';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import styles from './TablePlayerActions.module.css';

const HUD_GAME_PHASES: { phase: GamePhase; labelKey: string }[] = [
  { phase: GamePhase.WAITING_FOR_PLAYERS, labelKey: 'WAITING_FOR_PLAYERS' },
  { phase: GamePhase.SETUP, labelKey: 'SETUP' },
  { phase: GamePhase.DRAW, labelKey: 'DRAW' },
  { phase: GamePhase.PLAYER_TURN, labelKey: 'PLAYER_TURN' },
  { phase: GamePhase.ATTACK, labelKey: 'ATTACK' },
  { phase: GamePhase.AFTER_ATTACK, labelKey: 'AFTER_ATTACK' },
  { phase: GamePhase.CHOOSE_PRIZES, labelKey: 'CHOOSE_PRIZES' },
  { phase: GamePhase.BETWEEN_TURNS, labelKey: 'BETWEEN_TURNS' },
  { phase: GamePhase.FINISHED, labelKey: 'FINISHED' },
];

export type TablePlayerActionsProps = {
  localGame: LocalGameState;
  clientId: number;
  isPlaying: boolean;
  isObserver: boolean;
  onPassTurn: () => void;
  onLeave: () => void;
  onSwitchSides: () => void;
};

export function TablePlayerActions(props: TablePlayerActionsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { localGame, clientId, isPlaying, isObserver, onPassTurn, onLeave, onSwitchSides } = props;
  const state = localGame.state;
  const activePlayer = state.players[state.activePlayer];
  const isYourTurn =
    !!activePlayer &&
    activePlayer.id === clientId &&
    state.phase === GamePhase.PLAYER_TURN &&
    !localGame.replay;
  const isAdmin = user?.roleId === 4;

  const deleted = localGame.deleted;

  return (
    <div className={styles.root}>
      {localGame.replay || isObserver ? (
        <>
          <ShellButton type="button" variant="secondary" className={styles.compactBtn} onClick={onSwitchSides}>
            {t('TABLE_SWITCH_SIDES')}
          </ShellButton>
          <ShellButton type="button" variant="secondary" className={styles.compactBtn} onClick={onLeave}>
            {t('BUTTON_LEAVE')}
          </ShellButton>
        </>
      ) : null}
      {isPlaying ? (
        <>
          <ShellButton type="button" variant="secondary" className={styles.compactBtn} onClick={onLeave} disabled={!!deleted}>
            {t('BUTTON_LEAVE')}
          </ShellButton>
          <ShellButton type="button" className={cn(styles.compactBtn, styles.compactPrimary)} onClick={onPassTurn} disabled={!isYourTurn || !!deleted}>
            {t('TABLE_END_YOUR_TURN')}
          </ShellButton>
        </>
      ) : null}
      {isAdmin ? (
        <ul className={styles.phaseList} aria-label={t('SANDBOX_PHASE')}>
          {HUD_GAME_PHASES.map(({ phase, labelKey }) => (
            <li
              key={labelKey}
              className={cn(styles.phaseItem, state.phase === phase && styles.phaseItemActive)}
            >
              {t(labelKey)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
