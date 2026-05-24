import { useCallback, useEffect, useRef, useState } from 'react';
import type { LocalGameState } from '../types/localGameState';
import { computeMatchSplashState, type GameOverResultClass } from './computeGameOverPresentation';
import styles from './MatchResultsSplash.module.css';

const SPLASH_MS = 2500;
const LEAVE_MS = 400;

export type MatchResultsSplashProps = {
  localGame: LocalGameState;
  clientId: number;
  onDismiss: () => void;
};

function resultClassSuffix(c: GameOverResultClass): 'Victory' | 'Defeat' | 'Draw' {
  if (c === 'victory') return 'Victory';
  if (c === 'defeat') return 'Defeat';
  return 'Draw';
}

export function MatchResultsSplash({ localGame, clientId, onDismiss }: MatchResultsSplashProps) {
  const { displayText, resultClass } = computeMatchSplashState(localGame, clientId);
  const suffix = resultClassSuffix(resultClass);
  const [leaving, setLeaving] = useState(false);
  const dismissedRef = useRef(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const finish = useCallback(() => {
    if (dismissedRef.current) {
      return;
    }
    dismissedRef.current = true;
    setLeaving(true);
    window.setTimeout(() => {
      onDismissRef.current();
    }, LEAVE_MS);
  }, []);

  useEffect(() => {
    dismissedRef.current = false;
    setLeaving(false);
    const t = window.setTimeout(finish, SPLASH_MS);
    return () => clearTimeout(t);
  }, [localGame.localId, localGame.state.winner]);

  return (
    <div
      className={`${styles.overlay} ${leaving ? styles.overlayLeaving : ''}`}
      role="presentation"
    >
      <div className={styles.bg} />
      <div className={styles.content}>
        <div className={`${styles.textBack} ${styles[`textBack${suffix}`]}`}>{displayText}</div>
        <div className={`${styles.textFront} ${styles[`textFront${suffix}`]}`}>{displayText}</div>
      </div>
      <div className={styles.particles} />
    </div>
  );
}
