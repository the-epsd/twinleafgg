import { useEffect, useId, useState } from 'react';
import type {
  AbilityFocusAnchor,
  AbilityFocusState,
  BoardInteractionService,
} from '../BoardInteractionService';
import styles from './Board3dAbilityActivationOverlay.module.css';

export type Board3dAbilityActivationOverlayProps = {
  boardInteraction: BoardInteractionService;
};

const BAR_HEIGHT_RATIO = 0.14;
const BAR_HEIGHT_MIN_PX = 22;
const BAR_HEIGHT_MAX_PX = 36;

function polygonBounds(polygon: AbilityFocusAnchor['polygon']): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of polygon) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}

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
  const abilityName = typeof focus.abilityName === 'string' ? focus.abilityName.trim() : '';
  const holePoints = anchor.polygon.map((p) => `${p.x},${p.y}`).join(' ');
  const viewW = Math.max(
    1,
    anchor.canvasSize?.width ?? (typeof window !== 'undefined' ? window.innerWidth : 1),
  );
  const viewH = Math.max(
    1,
    anchor.canvasSize?.height ?? (typeof window !== 'undefined' ? window.innerHeight : 1),
  );

  const bounds = polygonBounds(anchor.polygon);
  const cardWidth = Math.max(0, bounds.maxX - bounds.minX);
  const cardHeight = Math.max(0, bounds.maxY - bounds.minY);
  const barHeight = Math.min(
    BAR_HEIGHT_MAX_PX,
    Math.max(BAR_HEIGHT_MIN_PX, cardHeight * BAR_HEIGHT_RATIO),
  );
  const barTop = bounds.minY + (cardHeight - barHeight) / 2;
  const barCenterX = bounds.minX + cardWidth / 2;
  const barCenterY = barTop + barHeight / 2;
  const fontSize = Math.max(12, Math.min(18, barHeight * 0.55));
  const showNameBar = abilityName.length > 0 && cardWidth > 0 && cardHeight > 0;
  const barFadeId = `${maskUid}-barFade`;

  return (
    <div className={styles.root} aria-hidden>
      <svg
        className={styles.maskLayer}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <mask id={maskUid} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
            <rect width={viewW} height={viewH} fill="white" />
            <polygon points={holePoints} fill="black" />
          </mask>
          <linearGradient id={barFadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="18%" stopColor="white" stopOpacity="1" />
            <stop offset="82%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask
            id={`${maskUid}-barMask`}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
          >
            <rect
              x={bounds.minX}
              y={barTop}
              width={cardWidth}
              height={barHeight}
              fill={`url(#${barFadeId})`}
            />
          </mask>
        </defs>
        <rect
          width={viewW}
          height={viewH}
          className={styles.dimFill}
          mask={`url(#${maskUid})`}
        />
        {showNameBar ? (
          <g className={styles.nameBarGroup} mask={`url(#${maskUid}-barMask)`}>
            <rect
              x={bounds.minX}
              y={barTop}
              width={cardWidth}
              height={barHeight}
              className={styles.nameBarFill}
            />
            <line
              x1={bounds.minX}
              y1={barTop + 0.5}
              x2={bounds.maxX}
              y2={barTop + 0.5}
              className={styles.nameBarEdge}
            />
            <text
              x={barCenterX}
              y={barCenterY}
              textAnchor="middle"
              dominantBaseline="central"
              className={styles.nameBarText}
              fontSize={fontSize}
            >
              {abilityName}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
