import { SlotType, type CardTarget, type CardView, type PromptView } from './types';

export type PromptClassName =
  | 'AlertPrompt'
  | 'ShowCardsPrompt'
  | 'ConfirmCardsPrompt'
  | 'ShowMulliganPrompt'
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
