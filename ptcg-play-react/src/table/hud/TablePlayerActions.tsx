import { useTranslation } from 'react-i18next';
import { GamePhase } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import styles from './TablePlayerActions.module.css';

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
  const { localGame, clientId, isPlaying, isObserver, onPassTurn, onLeave, onSwitchSides } = props;
  const state = localGame.state;
  const activePlayer = state.players[state.activePlayer];
  const isYourTurn =
    !!activePlayer &&
    activePlayer.id === clientId &&
    state.phase === GamePhase.PLAYER_TURN &&
    !localGame.replay;

  const deleted = localGame.deleted;

  return (
    <div className={styles.root}>
      {localGame.replay || isObserver ? (
        <ShellButton type="button" variant="secondary" className={styles.compactBtn} onClick={onSwitchSides}>
          {t('TABLE_SWITCH_SIDES')}
        </ShellButton>
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
    </div>
  );
}
