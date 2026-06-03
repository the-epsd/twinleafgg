import { SlotType, type CardTarget, type CardView, type GameView, type PromptView } from './types';

export type PromptClassName =
  | 'AlertPrompt'
  | 'ShowCardsPrompt'
  | 'ConfirmCardsPrompt'
  | 'ShowMulliganPrompt'
  | 'ShuffleDeckPrompt'
  | 'WaitPrompt'
  | 'ConfirmPrompt'
  | 'CoinFlipPrompt'
  | 'SelectPrompt'
  | 'SelectOptionPrompt'
  | 'ChooseAttackPrompt'
  | 'ChooseCardsPrompt'
  | 'ChoosePrizePrompt'
  | 'ChooseEnergyPrompt'
  | 'DiscardEnergyPrompt'
  | 'MoveEnergyPrompt'
  | 'AttachEnergyPrompt'
  | 'PutDamagePrompt'
  | 'MoveDamagePrompt'
  | 'RemoveDamagePrompt';

export type KnownPrompt =
  | (PromptView & { className: 'AlertPrompt' | 'ShowCardsPrompt' | 'ConfirmCardsPrompt' | 'ShowMulliganPrompt' })
  | (PromptView & { className: 'ShuffleDeckPrompt' })
  | (PromptView & { className: 'WaitPrompt'; fields: { duration?: number } & Record<string, unknown> })
  | (PromptView & { className: 'ConfirmPrompt' })
  | (PromptView & { className: 'CoinFlipPrompt' })
  | (PromptView & { className: 'SelectPrompt' | 'SelectOptionPrompt'; fields: { values?: unknown[] } & Record<string, unknown> })
  | (PromptView & { className: 'ChooseAttackPrompt' })
  | (PromptView & { className: 'ChooseCardsPrompt' })
  | (PromptView & { className: 'ChoosePrizePrompt' })
  | (PromptView & { className: 'ChooseEnergyPrompt' })
  | (PromptView & { className: 'DiscardEnergyPrompt' | 'MoveEnergyPrompt' })
  | (PromptView & { className: 'AttachEnergyPrompt' })
  | (PromptView & { className: 'PutDamagePrompt' | 'MoveDamagePrompt' | 'RemoveDamagePrompt' });

export type UnknownPrompt = PromptView;

export type Prompt = KnownPrompt | UnknownPrompt;

export type IndexedCardView = CardView & {
  index?: number;
};

export function isKnownPrompt(prompt: PromptView): prompt is KnownPrompt {
  return (
    prompt.className === 'AlertPrompt'
    || prompt.className === 'ShowCardsPrompt'
    || prompt.className === 'ConfirmCardsPrompt'
    || prompt.className === 'ShowMulliganPrompt'
    || prompt.className === 'ShuffleDeckPrompt'
    || prompt.className === 'WaitPrompt'
    || prompt.className === 'ConfirmPrompt'
    || prompt.className === 'CoinFlipPrompt'
    || prompt.className === 'SelectPrompt'
    || prompt.className === 'SelectOptionPrompt'
    || prompt.className === 'ChooseAttackPrompt'
    || prompt.className === 'ChooseCardsPrompt'
    || prompt.className === 'ChoosePrizePrompt'
    || prompt.className === 'ChooseEnergyPrompt'
    || prompt.className === 'DiscardEnergyPrompt'
    || prompt.className === 'MoveEnergyPrompt'
    || prompt.className === 'AttachEnergyPrompt'
    || prompt.className === 'PutDamagePrompt'
    || prompt.className === 'MoveDamagePrompt'
    || prompt.className === 'RemoveDamagePrompt'
  );
}

export function autoResolvablePromptResult(prompt: PromptView | undefined, game: GameView | null | undefined): unknown | undefined {
  if (!prompt) {
    return undefined;
  }
  if (
    prompt.className === 'AlertPrompt'
    || prompt.className === 'ShowCardsPrompt'
    || prompt.className === 'ConfirmCardsPrompt'
    || prompt.className === 'ShowMulliganPrompt'
  ) {
    return true;
  }
  if (prompt.className === 'ShuffleDeckPrompt') {
    const deckCount = game?.players[prompt.playerIndex]?.deckCount;
    if (typeof deckCount !== 'number' || !Number.isInteger(deckCount) || deckCount < 0) {
      return undefined;
    }
    return Array.from({ length: deckCount }, (_item, index) => index);
  }
  if (prompt.className === 'ConfirmPrompt' && prompt.message === 'GO_FIRST') {
    return true;
  }
  return undefined;
}

export function shouldAutoResolvePrompt(prompt: PromptView | undefined, autoConfirmPrompts: boolean, result: unknown): boolean {
  if (!prompt || result === undefined) {
    return false;
  }
  return isForcedAutoResolvePrompt(prompt) || autoConfirmPrompts;
}

export function isForcedAutoResolvePrompt(prompt: PromptView | undefined): boolean {
  return prompt?.className === 'ShuffleDeckPrompt'
    || (prompt?.className === 'ConfirmPrompt' && prompt.message === 'GO_FIRST');
}

export type PromptPlacement = 'center' | 'board' | 'zone';

const BOARD_PROMPT_CLASS_NAMES: ReadonlySet<string> = new Set<string>([
  'AttachEnergyPrompt',
  'PutDamagePrompt',
  'MoveDamagePrompt',
  'RemoveDamagePrompt',
  'ChoosePokemonPrompt',
]);

export function getPromptPlacement(className: string | undefined | null): PromptPlacement {
  if (className && BOARD_PROMPT_CLASS_NAMES.has(className)) {
    return 'board';
  }
  return 'center';
}

export function promptInstanceKey(
  prompt: Pick<PromptView, 'id' | 'className' | 'message'> | null | undefined,
) {
  return prompt ? `${prompt.id}:${prompt.className}:${prompt.message ?? ''}` : '';
}

export function promptOptions(prompt: Pick<PromptView, 'fields'> | null | undefined): Record<string, unknown> {
  return fieldOptions(prompt?.fields);
}

export function fieldOptions(fields: Record<string, unknown> | null | undefined): Record<string, unknown> {
  const options = fields?.options;
  return options && typeof options === 'object' ? (options as Record<string, unknown>) : {};
}

export function promptSlots(
  prompt: Pick<PromptView, 'fields'> | null | undefined,
  fallback: number[] = [SlotType.ACTIVE, SlotType.BENCH],
): number[] {
  const slots = prompt?.fields.slots;
  return Array.isArray(slots) ? (slots as number[]) : fallback;
}

export function promptBlockedIndexes(prompt: Pick<PromptView, 'fields'> | null | undefined): number[] {
  const blocked = promptOptions(prompt).blocked;
  return Array.isArray(blocked) ? blocked.filter((item): item is number => typeof item === 'number') : [];
}

export function promptBlockedTargets(
  prompt: Pick<PromptView, 'fields'> | null | undefined,
  key: 'blocked' | 'blockedTo' = 'blocked',
): CardTarget[] {
  const blocked = promptOptions(prompt)[key];
  return Array.isArray(blocked) ? (blocked as CardTarget[]) : [];
}

export function extractPromptCards(fields: Record<string, unknown> | null | undefined): IndexedCardView[] {
  const cardList = (fields?.cardList as IndexedCardView[] | undefined) ?? (fields?.cards as IndexedCardView[] | undefined);
  if (Array.isArray(cardList)) {
    return cardList;
  }
  const energy = fields?.energy as Array<{ index?: number; card?: CardView }> | undefined;
  if (Array.isArray(energy)) {
    return energy.map((item, index) => ({ index: item.index ?? index, ...(item.card ?? {}) }) as IndexedCardView);
  }
  return [];
}

export function samePromptIndexes(left: number[], right: number[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function prunePromptIndexes(indexes: number[], isSelectable: (index: number) => boolean, maxSelections: number) {
  return indexes.filter((index) => isSelectable(index)).slice(0, maxSelections);
}
