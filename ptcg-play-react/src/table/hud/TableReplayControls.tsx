import { useTranslation } from '../../i18n/strings';
import type { Replay } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { ShellButton } from '../../components/ui/ShellButton';
import styles from './TableReplayControls.module.css';

export type TableReplayControlsProps = {
  localGame: LocalGameState;
  replay: Replay;
  onStep: (nextPosition: number, state: LocalGameState['state'], logs: LocalGameState['logs']) => void;
};

export function TableReplayControls(props: TableReplayControlsProps) {
  const { t } = useTranslation();
  const { localGame, replay, onStep } = props;
  const count = replay.getStateCount();
  const pos = localGame.replayPosition;

  const go = (p: number) => {
    if (p < 1 || p > count) {
      return;
    }
    const state = replay.getState(p - 1);
    onStep(p, state, [...state.logs]);
  };

  return (
    <div className={styles.root}>
      <div className={styles.meta}>
        {t('REACT_REPLAY_POSITION', {
          defaultValue: 'Replay {{pos}} / {{count}}',
          pos,
          count,
        })}
      </div>
      <div className={styles.row}>
        <ShellButton
          type="button"
          variant="secondary"
          className={styles.replayBtn}
          disabled={pos <= 1}
          onClick={() => go(pos - 1)}
        >
          {t('REACT_REPLAY_PREV', { defaultValue: 'Prev' })}
        </ShellButton>
        <ShellButton
          type="button"
          variant="secondary"
          className={styles.replayBtn}
          disabled={pos >= count}
          onClick={() => go(pos + 1)}
        >
          {t('REACT_REPLAY_NEXT', { defaultValue: 'Next' })}
        </ShellButton>
      </div>
    </div>
  );
}
