import {
  includesTarget,
  type BoardInteractionStrategy,
} from '../boardInteraction';
import { labelFor } from '../labels';
import { promptOptions } from '../prompts';
import { promptLimit } from '../setupPrompt';
import { getBoardPromptTargets, sameTarget } from '../targets';
import type { CardTarget, GameView, PromptView } from '../types';

type ChoosePokemonStore = {
  selectedBoardTargets: CardTarget[];
  toggleBoardTarget: (target: CardTarget, maxSelections: number) => void;
  resetBoardTargets: () => void;
};

export function createChoosePokemonStrategy(args: {
  game: GameView;
  prompt: PromptView;
  store: ChoosePokemonStore;
  resolve: (value: unknown) => void;
}): BoardInteractionStrategy {
  const { game, prompt, store, resolve } = args;
  const options = promptOptions(prompt);
  const targets = getBoardPromptTargets(game, prompt);
  const minSelections = promptLimit(options.min, 1);
  const maxSelections = promptLimit(options.max, 1);

  function canConfirm() {
    return store.selectedBoardTargets.length >= minSelections;
  }

  return {
    key: `choose-pokemon:${prompt.id}`,
    isEligible: (target) => includesTarget(targets, target),
    isSelected: (target) => store.selectedBoardTargets.some((item) => sameTarget(item, target)),
    deltaFor: () => 0,
    activate(target) {
      if (!includesTarget(targets, target)) {
        return;
      }
      if (maxSelections <= 1) {
        resolve([target]);
        return;
      }
      store.toggleBoardTarget(target, maxSelections);
    },
    reset: () => store.resetBoardTargets(),
    confirm() {
      if (canConfirm()) {
        resolve(store.selectedBoardTargets);
      }
    },
    cancel: () => resolve(null),
    title: labelFor(prompt.message || prompt.type || prompt.className),
    hint: 'Select Pokemon on the board.',
    iconName: 'cards',
    get meta() {
      const selected = store.selectedBoardTargets.length;
      return {
        current: selected,
        max: maxSelections,
        secondary: selected < minSelections ? `${minSelections - selected} needed` : undefined,
      };
    },
    get canReset() {
      return store.selectedBoardTargets.length > 0;
    },
    get canConfirm() {
      return canConfirm();
    },
    allowCancel: !!options.allowCancel,
  };
}
