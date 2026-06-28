import type { CSSProperties } from 'react';
import type { CardType } from 'ptcg-server';
import { cn } from '../utils/cn';
import { cardTypeToEnergyAttr } from './cardInfoUtils';
import styles from './EnergyTypeIcon.module.css';

const ATTR_TO_CLASS: Record<string, string> = {
  grass: styles.grass,
  fighting: styles.fighting,
  psychic: styles.psychic,
  water: styles.water,
  lightning: styles.lightning,
  metal: styles.metal,
  darkness: styles.darkness,
  fire: styles.fire,
  dragon: styles.dragon,
  fairy: styles.fairy,
  colorless: styles.colorless,
  energyless: styles.energyless,
};

const ICON_BOX_REM = 2;

const ICON_SCALE = {
  default: 0.75,
  compact: 0.62,
} as const;

export type EnergyTypeIconSize = keyof typeof ICON_SCALE;

/** ~3px visual gap between scaled icons in a row. */
const INTER_ICON_GAP_REM = 0.1875;

function layoutMarginForScale(scale: number, collapseLayout: boolean): string {
  if (!collapseLayout || scale >= 1) {
    return '1px 1px';
  }
  // Transform scale does not shrink layout box — partially collapse trailing whitespace.
  const collapseRem = ICON_BOX_REM * scale - ICON_BOX_REM + INTER_ICON_GAP_REM;
  return `1px ${collapseRem}rem 1px 1px`;
}

export function EnergyTypeIcon({
  type,
  className,
  style,
  size = 'default',
  collapseLayout = true,
}: {
  type: CardType;
  className?: string;
  style?: CSSProperties;
  size?: EnergyTypeIconSize;
  /** When false, keeps the full 2rem layout margin (e.g. card type next to HP). */
  collapseLayout?: boolean;
}) {
  const attr = cardTypeToEnergyAttr(type);
  const typeClass = ATTR_TO_CLASS[attr] ?? styles.energyless;
  const scale = ICON_SCALE[size];
  const extraTransform = style?.transform?.trim();
  const transform = extraTransform ? `scale(${scale}) ${extraTransform}` : `scale(${scale})`;
  const { transform: _omit, margin: styleMargin, ...restStyle } = style ?? {};
  const margin = styleMargin ?? layoutMarginForScale(scale, collapseLayout);
  return (
    <span
      className={cn(styles.energy, typeClass, className)}
      style={{ ...restStyle, transform, margin }}
      role="img"
      aria-hidden
    />
  );
}
