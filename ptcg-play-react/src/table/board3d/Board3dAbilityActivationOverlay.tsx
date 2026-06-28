import { useEffect, useId, useState } from 'react';
import type { AbilityFocusState, BoardInteractionService } from '../BoardInteractionService';
import styles from './Board3dAbilityActivationOverlay.module.css';

export type Board3dAbilityActivationOverlayProps = {
  boardInteraction: BoardInteractionService;
};

export function Board3dAbilityActivationOverlay({
  boardInteraction,
}: Board3dAbilityActivationOverlayProps) {
  const [focus, setFocus] = useState<AbilityFocusState | null>(null);
  const maskUid = useId().replace(/:/g, '');

  useEffect(() => {
    const sub = boardInteraction.abilityFocus$.subscribe(setFocus);
    return () => sub.unsubscribe();
  }, [boardInteraction]);

  if (!focus?.anchor || focus.anchor.polygon.length < 3) {
    return null;
  }

  const { anchor } = focus;
  const holePoints = anchor.polygon.map((p) => `${p.x},${p.y}`).join(' ');
  const viewW = typeof window !== 'undefined' ? window.innerWidth : 1;
  const viewH = typeof window !== 'undefined' ? window.innerHeight : 1;

  return (
    <div className={styles.root} aria-hidden>
      <svg
        className={styles.maskLayer}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <mask id={maskUid}>
            <rect width="100%" height="100%" fill="white" />
            <polygon points={holePoints} fill="black" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          className={styles.dimFill}
          mask={`url(#${maskUid})`}
        />
      </svg>
    </div>
  );
}
