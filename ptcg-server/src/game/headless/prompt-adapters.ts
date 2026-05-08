import { Card } from '../store/card/card';
import { Prompt } from '../store/prompts/prompt';
import { State } from '../store/state/state';
import { AlertPrompt } from '../store/prompts/alert-prompt';
import { AttachEnergyPrompt } from '../store/prompts/attach-energy-prompt';
import { ChooseAttackPrompt } from '../store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../store/prompts/choose-cards-prompt';
import { ChooseEnergyPrompt } from '../store/prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../store/prompts/choose-prize-prompt';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { ConfirmCardsPrompt } from '../store/prompts/confirm-cards-prompt';
import { ConfirmPrompt } from '../store/prompts/confirm-prompt';
import { DiscardEnergyPrompt } from '../store/prompts/discard-energy-prompt';
import { InvitePlayerPrompt } from '../store/prompts/invite-player-prompt';
import { MoveDamagePrompt } from '../store/prompts/move-damage-prompt';
import { MoveEnergyPrompt } from '../store/prompts/move-energy-prompt';
import { OrderCardsPrompt } from '../store/prompts/order-cards-prompt';
import { PutDamagePrompt } from '../store/prompts/put-damage-prompt';
import { RemoveDamagePrompt } from '../store/prompts/remove-damage-prompt';
import { SelectOptionPrompt } from '../store/prompts/select-option-prompt';
import { SelectPrompt } from '../store/prompts/select-prompt';
import { ShowCardsPrompt } from '../store/prompts/show-cards-prompt';
import { ShowMulliganPrompt } from '../store/prompts/show-mulligan-prompt';
import { ShuffleHandPrompt } from '../store/prompts/shuffle-hand-prompt';
import { ShufflePrizesPrompt } from '../store/prompts/shuffle-prizes-prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { WaitPrompt } from '../store/prompts/wait-prompt';

export interface HeadlessPromptJson {
  id: number;
  className: string;
  type: string;
  playerId: number;
  supported: boolean;
  unsupportedReason?: string;
  message?: string;
  resultSchema: string;
  fields: any;
}

export interface HeadlessPromptAdapter {
  className: string;
  classValue: new (...args: any[]) => Prompt<any>;
  supported: boolean;
  resultSchema: string;
  unsupportedReason?: string;
}

export const HEADLESS_PROMPT_ADAPTERS: HeadlessPromptAdapter[] = [
  adapter(AlertPrompt, true, 'true'),
  adapter(AttachEnergyPrompt, true, '{ to: CardTarget, index: number }[] | null'),
  adapter(ChooseAttackPrompt, true, '{ index: number, attack: string } | null'),
  adapter(ChooseCardsPrompt, true, 'number[] | null'),
  adapter(ChooseEnergyPrompt, true, 'number[] | null'),
  adapter(ChoosePokemonPrompt, true, 'CardTarget[] | null'),
  adapter(ChoosePrizePrompt, true, 'number[] | null'),
  adapter(CoinFlipPrompt, true, 'boolean'),
  adapter(ConfirmCardsPrompt, true, 'true'),
  adapter(ConfirmPrompt, true, 'boolean'),
  adapter(DiscardEnergyPrompt, true, '{ from: CardTarget, index: number }[] | null'),
  adapter(InvitePlayerPrompt, false, 'string[] | { deck: string[], sleeveImagePath?: string } | null', 'InvitePlayerPrompt belongs to socket matchmaking; headless games should use newGame/setupScenario instead.'),
  adapter(MoveDamagePrompt, true, '{ from: CardTarget, to: CardTarget }[] | null'),
  adapter(MoveEnergyPrompt, true, '{ from: CardTarget, to: CardTarget, index: number }[] | null'),
  adapter(OrderCardsPrompt, true, 'number[] | null'),
  adapter(PutDamagePrompt, true, '{ target: CardTarget, damage: number }[] | null'),
  adapter(RemoveDamagePrompt, true, '{ from: CardTarget, to: CardTarget }[] | null'),
  adapter(SelectOptionPrompt, true, 'number | null'),
  adapter(SelectPrompt, true, 'number | null'),
  adapter(ShowCardsPrompt, true, 'true'),
  adapter(ShowMulliganPrompt, true, 'true'),
  adapter(ShuffleDeckPrompt, true, 'number[]'),
  adapter(ShuffleHandPrompt, false, 'number[]', 'ShuffleHandPrompt is registered by the serializer but has no production instantiations and validates against prize count rather than hand count.'),
  adapter(ShufflePrizesPrompt, true, 'number[]'),
  adapter(WaitPrompt, true, 'null')
];

function adapter(
  classValue: new (...args: any[]) => Prompt<any>,
  supported: boolean,
  resultSchema: string,
  unsupportedReason?: string
): HeadlessPromptAdapter {
  return {
    className: classValue.name,
    classValue,
    supported,
    resultSchema,
    unsupportedReason
  };
}

export function getHeadlessPromptAdapter(prompt: Prompt<any>): HeadlessPromptAdapter | undefined {
  return HEADLESS_PROMPT_ADAPTERS.find(item => prompt instanceof item.classValue);
}

export function serializeHeadlessPrompt(state: State, prompt: Prompt<any>): HeadlessPromptJson {
  const adapterConfig = getHeadlessPromptAdapter(prompt);
  if (!adapterConfig) {
    throw new Error(`[headless] Missing prompt adapter for "${prompt.constructor.name}" (${prompt.type})`);
  }
  return {
    id: prompt.id,
    className: adapterConfig.className,
    type: prompt.type,
    playerId: prompt.playerId,
    supported: adapterConfig.supported,
    unsupportedReason: adapterConfig.unsupportedReason,
    message: stringify((prompt as any).message),
    resultSchema: adapterConfig.resultSchema,
    fields: serializePromptFields(state, prompt)
  };
}

function serializePromptFields(state: State, prompt: Prompt<any>): any {
  const promptAny = prompt as any;
  const fields: any = {};
  copyIfPresent(fields, promptAny, 'duration');
  copyIfPresent(fields, promptAny, 'playerType');
  copyIfPresent(fields, promptAny, 'slots');
  copyIfPresent(fields, promptAny, 'filter');
  copyIfPresent(fields, promptAny, 'options');
  copyIfPresent(fields, promptAny, 'values');
  copyIfPresent(fields, promptAny, 'damage');
  copyIfPresent(fields, promptAny, 'cost');
  if (promptAny.cards?.cards) {
    fields.cardList = summarizeCards(promptAny.cards.cards);
  } else if (Array.isArray(promptAny.cards)) {
    fields.cards = summarizeCards(promptAny.cards);
  }
  if (promptAny.cardList?.cards) {
    fields.cardList = summarizeCards(promptAny.cardList.cards);
  }
  if (Array.isArray(promptAny.energy)) {
    fields.energy = promptAny.energy.map((item: any, index: number) => ({
      index,
      card: summarizeCard(item.card),
      provides: item.provides
    }));
  }
  if (Array.isArray(promptAny.maxAllowedDamage)) {
    fields.maxAllowedDamage = promptAny.maxAllowedDamage;
  }
  if (Array.isArray(promptAny.hands)) {
    fields.hands = promptAny.hands.map((cards: Card[]) => summarizeCards(cards));
  }
  if (prompt instanceof ShuffleDeckPrompt) {
    fields.cards = summarizeCards(state.players.find(player => player.id === prompt.playerId)?.deck.cards ?? []);
  }
  if (prompt instanceof ShuffleHandPrompt) {
    fields.cards = summarizeCards(state.players.find(player => player.id === prompt.playerId)?.hand.cards ?? []);
  }
  if (prompt instanceof ShufflePrizesPrompt) {
    fields.cards = summarizeCards(state.players.find(player => player.id === prompt.playerId)
      ?.prizes.reduce((cards: Card[], prize) => cards.concat(prize.cards), []) ?? []);
  }
  return fields;
}

function copyIfPresent(target: any, source: any, key: string): void {
  if (source[key] !== undefined) {
    target[key] = source[key];
  }
}

function summarizeCards(cards: Card[]): any[] {
  return cards.map((card, index) => ({
    index,
    ...summarizeCard(card)
  }));
}

function summarizeCard(card: Card | undefined): any {
  if (!card) {
    return undefined;
  }
  return {
    id: card.id,
    name: card.name,
    fullName: card.fullName,
    superType: card.superType,
    cardType: (card as any).cardType,
    trainerType: (card as any).trainerType,
    energyType: (card as any).energyType,
    stage: (card as any).stage,
    attacks: Array.isArray((card as any).attacks)
      ? (card as any).attacks.map((attack: any) => ({
        name: attack.name,
        cost: attack.cost,
        damage: attack.damage
      }))
      : undefined
  };
}

function stringify(value: any): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return String(value);
}
