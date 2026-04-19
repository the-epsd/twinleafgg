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

export function EnergyTypeIcon({
  type,
  className,
  style,
}: {
  type: CardType;
  className?: string;
  style?: CSSProperties;
}) {
  const attr = cardTypeToEnergyAttr(type);
  const typeClass = ATTR_TO_CLASS[attr] ?? styles.energyless;
  return <span className={cn(styles.energy, typeClass, className)} style={style} role="img" aria-hidden />;
}
