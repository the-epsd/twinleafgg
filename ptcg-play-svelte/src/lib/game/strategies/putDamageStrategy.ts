import {
  includesTarget,
  type BoardInteractionStrategy,
} from '../boardInteraction';
import { promptOptions } from '../prompts';
import { promptLimit } from '../setupPrompt';
import type { CardTarget, GameView, PromptView } from '../types';
import { getBoardPromptTargets } from '../targets';
import {
  maxDamageForTarget,
  totalPlacedDamage,
  type DamagePlacement,
} from '../../../state/promptSelectionModel';

type PutDamageStore = {
  damagePlacements: DamagePlacement[];
  placeDamage: (target: CardTarget, amount: number, requiredDamage: number, maxAllowedDamage: DamagePlacement[]) => void;
  resetDamagePlacements: () => void;
  damageForTarget: (target: CardTarget) => number;
  damageResult: () => unknown;
};

export function createPutDamageStrategy(args: {
  game: GameView;
  prompt: PromptView;
  store: PutDamageStore;
  resolve: (value: unknown) => void;
}): BoardInteractionStrategy {
  const { game, prompt, store, resolve } = args;
  const options = promptOptions(prompt);
  const targets = getBoardPromptTargets(game, prompt);
  const step = promptLimit(options.damageMultiple, 10);
  const requiredDamage = promptLimit(prompt.fields.damage, 0);
  const maxAllowedDamage = normalizeDamagePlacements(prompt.fields.maxAllowedDamage);
  const allowPartialDamage = !!options.allowPlacePartialDamage;

  function placedTotal() {
    return totalPlacedDamage(store.damagePlacements);
  }

  function canPlace(target: CardTarget) {
    if (!includesTarget(targets, target) || placedTotal() + step > requiredDamage) {
      return false;
    }
    return store.damageForTarget(target) + step <= maxDamageForTarget(maxAllowedDamage, target);
  }

  function canConfirm() {
    const total = placedTotal();
    return total > 0 && (allowPartialDamage ? total <= requiredDamage : total === requiredDamage);
  }

  return {
    key: `put-damage:${prompt.id}`,
    isEligible: canPlace,
    isSelected: (target) => store.damageForTarget(target) > 0,
    deltaFor: (target) => store.damageForTarget(target),
    activate(target) {
      if (canPlace(target)) {
        store.placeDamage(target, step, requiredDamage, maxAllowedDamage);
      }
    },
    reset: () => store.resetDamagePlacements(),
    confirm() {
      if (canConfirm()) {
        resolve(store.damageResult());
      }
    },
    cancel: () => resolve(null),
    title: prompt.className === 'PutDamagePrompt' ? 'Place damage' : 'Damage',
    hint: 'Tap a Pokemon on the board to place damage.',
    iconName: 'damage',
    get meta() {
      const remaining = Math.max(0, requiredDamage - placedTotal());
      return {
        current: placedTotal(),
        max: requiredDamage,
        secondary: remaining > 0 ? `${remaining} left` : undefined,
      };
    },
    get canReset() {
      return placedTotal() > 0;
    },
    get canConfirm() {
      return canConfirm();
    },
    allowCancel: !!options.allowCancel,
  };
}

function normalizeDamagePlacements(value: unknown): DamagePlacement[] {
  return Array.isArray(value)
    ? value.filter((item): item is DamagePlacement =>
        item
          && typeof item === 'object'
          && 'target' in item
          && 'damage' in item
          && typeof item.damage === 'number',
      )
    : [];
}
