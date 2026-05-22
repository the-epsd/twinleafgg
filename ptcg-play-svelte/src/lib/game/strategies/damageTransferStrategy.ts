import {
  includesTarget,
  slotForTarget,
  type BoardInteractionStrategy,
} from '../boardInteraction';
import { promptOptions } from '../prompts';
import { promptLimit } from '../setupPrompt';
import { getDamageTransferTargets, sameTarget, type PromptTargetOption } from '../targets';
import type { CardTarget, GameView, PromptView } from '../types';
import type { DamageTransferPair } from '../../../state/damageTransfer.svelte';

type DamageTransferStore = {
  source: CardTarget | null;
  destination: CardTarget | null;
  pairs: DamageTransferPair[];
  counterCount: number;
  selectSource: (target: CardTarget) => void;
  addCounter: (destination: CardTarget, maxCounters: number) => void;
  reset: () => void;
  isSource: (target: CardTarget) => boolean;
  isDestination: (target: CardTarget) => boolean;
  result: () => DamageTransferPair[];
};

export function createDamageTransferStrategy(args: {
  game: GameView;
  prompt: PromptView;
  store: DamageTransferStore;
  resolve: (value: unknown) => void;
}): BoardInteractionStrategy {
  const { game, prompt, store, resolve } = args;
  const options = promptOptions(prompt);
  const sources = getDamageTransferTargets(game, prompt, 'blockedFrom');
  const destinations = getDamageTransferTargets(game, prompt, 'blockedTo');
  const minCounters = promptLimit(options.min, 1);
  const maxCounters = promptLimit(options.max, 1);
  const damagePerCounter = promptLimit(options.damageMultiple, 10);
  const sameDestination = !!options.sameTarget;

  function damageOf(target: CardTarget) {
    return slotForTarget(game, prompt, target)?.damage ?? 0;
  }

  function effectiveMaxCounters() {
    return store.source
      ? Math.min(maxCounters, Math.floor(damageOf(store.source) / damagePerCounter))
      : maxCounters;
  }

  function sourceLabel() {
    return store.source ? labelForTarget(sources, store.source) : null;
  }

  function destinationLabel() {
    return store.destination ? labelForTarget(destinations, store.destination) : null;
  }

  function isSourceCandidate(target: CardTarget) {
    return includesTarget(sources.map((item) => item.target), target) && damageOf(target) >= damagePerCounter;
  }

  function isDestinationCandidate(target: CardTarget) {
    return includesTarget(destinations.map((item) => item.target), target);
  }

  function isEligible(target: CardTarget) {
    if (!store.source) {
      return isSourceCandidate(target);
    }
    if (store.counterCount >= effectiveMaxCounters()) {
      return false;
    }
    if (sameDestination && store.destination) {
      return store.isDestination(target);
    }
    return isDestinationCandidate(target);
  }

  function canConfirm() {
    return store.counterCount >= minCounters && store.counterCount > 0;
  }

  return {
    key: `damage-transfer:${prompt.id}`,
    isEligible,
    isSelected: (target) => store.isSource(target) || store.isDestination(target),
    deltaFor(target) {
      if (store.counterCount === 0) {
        return 0;
      }
      const moved = store.counterCount * damagePerCounter;
      if (store.isSource(target)) {
        return -moved;
      }
      if (store.isDestination(target)) {
        return moved;
      }
      return 0;
    },
    activate(target) {
      if (!isEligible(target)) {
        return;
      }
      if (!store.source) {
        store.selectSource(target);
        return;
      }
      store.addCounter(target, effectiveMaxCounters());
    },
    reset: () => store.reset(),
    confirm() {
      if (canConfirm()) {
        resolve(store.result());
        store.reset();
      }
    },
    cancel: () => resolve(null),
    get title() {
      return prompt.className === 'RemoveDamagePrompt' ? 'Remove damage' : 'Move damage';
    },
    get hint() {
      const source = sourceLabel();
      const destination = destinationLabel();
      const moved = store.counterCount * damagePerCounter;
      const maxDamage = effectiveMaxCounters() * damagePerCounter;
      if (!source) {
        return 'Pick a damaged Pokemon to move damage from.';
      }
      if (!destination) {
        return `Moving from ${source}; pick where the damage goes.`;
      }
      if (store.counterCount >= effectiveMaxCounters()) {
        return `Moving ${moved} damage from ${source} to ${destination}.`;
      }
      return `Moving from ${source} to ${destination}. Tap ${destination} again for more, up to ${maxDamage}.`;
    },
    iconName: 'damage',
    get meta() {
      return {
        current: store.counterCount * damagePerCounter,
        max: effectiveMaxCounters() * damagePerCounter,
        secondary: store.counterCount > 0 ? `${store.counterCount}/${effectiveMaxCounters()} counters` : undefined,
      };
    },
    get canReset() {
      return !!store.source || store.counterCount > 0;
    },
    get canConfirm() {
      return canConfirm();
    },
    allowCancel: !!options.allowCancel,
  };
}

function labelForTarget(options: PromptTargetOption[], target: CardTarget) {
  return options.find((item) => sameTarget(item.target, target))?.label ?? null;
}
