import { CardType } from 'ptcg-server';
import type { SfxId } from './sfxAssets';
import { playSfx } from './playSfx';

type AttackSize = 'Small' | 'Medium' | 'Big';

type AttackTypeKey =
  | 'grass'
  | 'fire'
  | 'water'
  | 'lightning'
  | 'psychic'
  | 'fighting'
  | 'darkness'
  | 'metal'
  | 'colorless';

function attackSize(damage: number): AttackSize {
  if (damage < 100) {
    return 'Small';
  }
  if (damage < 200) {
    return 'Medium';
  }
  return 'Big';
}

function attackTypeKey(cardType: CardType): AttackTypeKey | null {
  switch (cardType) {
    case CardType.GRASS:
      return 'grass';
    case CardType.FIRE:
      return 'fire';
    case CardType.WATER:
      return 'water';
    case CardType.LIGHTNING:
      return 'lightning';
    case CardType.PSYCHIC:
      return 'psychic';
    case CardType.FIGHTING:
      return 'fighting';
    case CardType.DARK:
      return 'darkness';
    case CardType.METAL:
      return 'metal';
    case CardType.COLORLESS:
    case CardType.FAIRY:
    case CardType.DRAGON:
      return 'colorless';
    default:
      return null;
  }
}

function attackSfxId(typeKey: AttackTypeKey, size: AttackSize): SfxId {
  const prefix = `${typeKey}Attack` as const;
  return `${prefix}${size}` as SfxId;
}

/** Play typed attack whoosh; size from damage (<100 small, <200 medium, else big). */
export function playAttackSfx(cardType: CardType, damage = 0): void {
  if (cardType == null || cardType === CardType.NONE || cardType === CardType.ANY) {
    return;
  }
  const typeKey = attackTypeKey(cardType);
  if (!typeKey) {
    return;
  }
  playSfx(attackSfxId(typeKey, attackSize(damage)), { exclusive: true });
}
