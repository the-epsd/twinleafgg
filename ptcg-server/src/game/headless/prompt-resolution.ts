import { Card } from '../store/card/card';
import { SuperType } from '../store/card/card-types';
import { Action } from '../store/actions/action';
import { PlayerType, SlotType, CardTarget } from '../store/actions/play-card-action';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
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
import { Prompt } from '../store/prompts/prompt';
import { PutDamagePrompt } from '../store/prompts/put-damage-prompt';
import { RemoveDamagePrompt } from '../store/prompts/remove-damage-prompt';
import { SelectOptionPrompt } from '../store/prompts/select-option-prompt';
import { SelectPrompt } from '../store/prompts/select-prompt';
import { ShowMulliganPrompt } from '../store/prompts/show-mulligan-prompt';
import { ShuffleHandPrompt } from '../store/prompts/shuffle-hand-prompt';
import { ShufflePrizesPrompt } from '../store/prompts/shuffle-prizes-prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { WaitPrompt } from '../store/prompts/wait-prompt';
import { AlertPrompt } from '../store/prompts/alert-prompt';
import { ShowCardsPrompt } from '../store/prompts/show-cards-prompt';
import { ConfirmCardsPrompt as ConfirmCardsPromptClass } from '../store/prompts/confirm-cards-prompt';
import { State } from '../store/state/state';
import { Player } from '../store/state/player';
import { getHeadlessPromptAdapter } from './prompt-adapters';

export type HeadlessPromptOverride = (prompt: Prompt<any>, state: State) => any;

export class HeadlessPromptResolver {
  private overrides = new Map<string, HeadlessPromptOverride>();

  public overrideOnce(promptType: string, handler: HeadlessPromptOverride): void {
    this.overrides.set(promptType, handler);
  }

  public resolve(state: State, prompt: Prompt<any>): Action {
    const override = this.overrides.get(prompt.type);
    if (override) {
      this.overrides.delete(prompt.type);
      return this.toAction(state, prompt, override(prompt, state));
    }
    return this.toAction(state, prompt, this.defaultRawResult(state, prompt));
  }

  private toAction(state: State, prompt: Prompt<any>, rawResult: any): ResolvePromptAction {
    const decoded = prompt.decode(rawResult, state);
    if (prompt.validate(decoded, state) === false) {
      throw new Error(`[headless] Invalid prompt result for "${prompt.type}": ${JSON.stringify(rawResult)}`);
    }
    return new ResolvePromptAction(prompt.id, decoded, undefined, rawResult);
  }

  public defaultRawResult(state: State, prompt: Prompt<any>): any {
    const adapter = getHeadlessPromptAdapter(prompt);
    if (!adapter) {
      throw new Error(`[headless] Missing prompt adapter for "${prompt.constructor.name}" (${prompt.type})`);
    }
    if (!adapter.supported) {
      throw new Error(`[headless] Unsupported prompt "${adapter.className}": ${adapter.unsupportedReason ?? 'not supported'}`);
    }
    if (prompt instanceof AlertPrompt
      || prompt instanceof ShowCardsPrompt
      || prompt instanceof ConfirmPrompt
      || prompt instanceof ConfirmCardsPrompt
      || prompt instanceof ConfirmCardsPromptClass
      || prompt instanceof ShowMulliganPrompt) {
      return true;
    }
    if (prompt instanceof WaitPrompt) {
      return null;
    }
    if (prompt instanceof CoinFlipPrompt) {
      return true;
    }
    if (prompt instanceof ShuffleDeckPrompt) {
      return this.resolveShuffleRaw(state, prompt);
    }
    if (prompt instanceof ShuffleHandPrompt) {
      return this.resolveShuffleHandRaw(state, prompt);
    }
    if (prompt instanceof ShufflePrizesPrompt) {
      return this.resolveShufflePrizesRaw(state, prompt);
    }
    if (prompt instanceof ChooseCardsPrompt) {
      return this.resolveChooseCardsRaw(prompt);
    }
    if (prompt instanceof ChooseAttackPrompt) {
      return this.resolveChooseAttackRaw(prompt);
    }
    if (prompt instanceof ChoosePokemonPrompt) {
      return this.resolveChoosePokemonRaw(state, prompt);
    }
    if (prompt instanceof AttachEnergyPrompt) {
      return this.resolveAttachEnergyRaw(state, prompt);
    }
    if (prompt instanceof ChooseEnergyPrompt) {
      return this.resolveChooseEnergyRaw(prompt);
    }
    if (prompt instanceof SelectPrompt) {
      return prompt.options.defaultValue;
    }
    if (prompt instanceof SelectOptionPrompt) {
      if (!prompt.options.disabled?.[prompt.options.defaultValue]) {
        return prompt.options.defaultValue;
      }
      const index = prompt.values.findIndex((_, i) => !prompt.options.disabled?.[i]);
      return index === -1 ? null : index;
    }
    if (prompt instanceof ChoosePrizePrompt) {
      return this.resolveChoosePrizeRaw(state, prompt);
    }
    if (prompt instanceof OrderCardsPrompt) {
      return prompt.cards.cards.map((_, index) => index);
    }
    if (prompt instanceof PutDamagePrompt) {
      return this.resolvePutDamageRaw(prompt);
    }
    if (prompt instanceof MoveDamagePrompt || prompt instanceof RemoveDamagePrompt) {
      return this.resolveDamageTransferRaw(prompt);
    }
    if (prompt instanceof MoveEnergyPrompt) {
      return prompt.options.allowCancel ? null : [];
    }
    if (prompt instanceof DiscardEnergyPrompt) {
      return this.resolveDiscardEnergyRaw(state, prompt);
    }
    if (prompt instanceof InvitePlayerPrompt) {
      return [];
    }
    throw new Error(`[headless] No default resolver for "${prompt.constructor.name}" (${prompt.type})`);
  }

  private resolveShuffleRaw(state: State, prompt: ShuffleDeckPrompt): number[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    return player ? player.deck.cards.map((_, index) => index) : [];
  }

  private resolveShuffleHandRaw(state: State, prompt: ShuffleHandPrompt): number[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    return player ? player.hand.cards.map((_, index) => index) : [];
  }

  private resolveShufflePrizesRaw(state: State, prompt: ShufflePrizesPrompt): number[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    const count = player ? player.prizes.reduce((sum, prize) => sum + prize.cards.length, 0) : 0;
    return Array.from({ length: count }, (_, index) => index);
  }

  private resolveChooseCardsRaw(prompt: ChooseCardsPrompt): number[] | null {
    const blocked = new Set(prompt.options.blocked);
    const indices: number[] = [];
    for (let i = 0; i < prompt.cards.cards.length && indices.length < prompt.options.max; i++) {
      if (!blocked.has(i)) {
        indices.push(i);
      }
    }
    if (indices.length < prompt.options.min) {
      return prompt.options.allowCancel ? null : indices;
    }
    return indices;
  }

  private resolveChooseAttackRaw(prompt: ChooseAttackPrompt): any {
    const blocked = new Set(prompt.options.blocked.map(item => `${item.index}:${item.attack}`));
    for (let cardIndex = 0; cardIndex < prompt.cards.length; cardIndex++) {
      const card = prompt.cards[cardIndex] as any;
      const attacks = Array.isArray(card.attacks) ? card.attacks : [];
      const attack = attacks.find((item: any) => !blocked.has(`${cardIndex}:${item.name}`));
      if (attack) {
        return { index: cardIndex, attack: attack.name };
      }
    }
    return prompt.options.allowCancel ? null : { index: 0, attack: '' };
  }

  private getPromptPlayers(state: State, prompt: Prompt<any>): { player: Player; opponent: Player } | undefined {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    return player && opponent ? { player, opponent } : undefined;
  }

  private toTargetKey(target: CardTarget): string {
    return `${target.player}-${target.slot}-${target.index}`;
  }

  private resolveChoosePokemonRaw(state: State, prompt: ChoosePokemonPrompt): CardTarget[] | null {
    const promptPlayers = this.getPromptPlayers(state, prompt);
    if (!promptPlayers) {
      return null;
    }

    const blockedSet = new Set(prompt.options.blocked.map(target => this.toTargetKey(target)));
    const targets: CardTarget[] = [];
    for (const playerType of [PlayerType.BOTTOM_PLAYER, PlayerType.TOP_PLAYER]) {
      if (prompt.playerType !== PlayerType.ANY && prompt.playerType !== playerType) {
        continue;
      }
      const player = playerType === PlayerType.BOTTOM_PLAYER ? promptPlayers.player : promptPlayers.opponent;
      if (prompt.slots.includes(SlotType.ACTIVE) && player.active.cards.length > 0) {
        const target = { player: playerType, slot: SlotType.ACTIVE, index: 0 };
        if (!blockedSet.has(this.toTargetKey(target))) {
          targets.push(target);
        }
      }
      if (prompt.slots.includes(SlotType.BENCH)) {
        for (let i = 0; i < player.bench.length; i++) {
          if (player.bench[i].cards.length > 0) {
            const target = { player: playerType, slot: SlotType.BENCH, index: i };
            if (!blockedSet.has(this.toTargetKey(target))) {
              targets.push(target);
            }
          }
        }
      }
    }

    if (targets.length < prompt.options.min) {
      return prompt.options.allowCancel ? null : [];
    }
    return targets.slice(0, prompt.options.max);
  }

  private cardMatchesPartialFilter(card: Card, filter: Partial<Card>): boolean {
    for (const key in filter) {
      if ((card as any)[key] !== (filter as any)[key]) {
        return false;
      }
    }
    return true;
  }

  private resolveAttachEnergyRaw(state: State, prompt: AttachEnergyPrompt): any {
    const promptPlayers = this.getPromptPlayers(state, prompt);
    if (!promptPlayers) {
      return null;
    }
    const { player, opponent } = promptPlayers;
    const blocked = new Set(prompt.options.blocked);
    const energyIndex = prompt.cardList.cards.findIndex((card, index) => {
      return !blocked.has(index) && card.superType === SuperType.ENERGY && this.cardMatchesPartialFilter(card, prompt.filter);
    });
    if (energyIndex === -1) {
      return prompt.options.allowCancel ? null : [];
    }
    const targets = this.buildTargets(player, opponent, prompt.playerType, prompt.slots, prompt.options.blockedTo);
    if (targets.length === 0) {
      return prompt.options.allowCancel ? null : [];
    }
    return [{ to: targets[0], index: energyIndex }];
  }

  private buildTargets(
    player: Player,
    opponent: Player,
    playerType: PlayerType,
    slots: SlotType[],
    blocked: CardTarget[]
  ): CardTarget[] {
    const blockedSet = new Set(blocked.map(target => this.toTargetKey(target)));
    const result: CardTarget[] = [];
    for (const type of [PlayerType.BOTTOM_PLAYER, PlayerType.TOP_PLAYER]) {
      if (playerType !== PlayerType.ANY && playerType !== type) {
        continue;
      }
      const targetPlayer = type === PlayerType.BOTTOM_PLAYER ? player : opponent;
      if (slots.includes(SlotType.ACTIVE) && targetPlayer.active.cards.length > 0) {
        const target = { player: type, slot: SlotType.ACTIVE, index: 0 };
        if (!blockedSet.has(this.toTargetKey(target))) {
          result.push(target);
        }
      }
      if (slots.includes(SlotType.BENCH)) {
        for (let i = 0; i < targetPlayer.bench.length; i++) {
          if (targetPlayer.bench[i].cards.length > 0) {
            const target = { player: type, slot: SlotType.BENCH, index: i };
            if (!blockedSet.has(this.toTargetKey(target))) {
              result.push(target);
            }
          }
        }
      }
    }
    return result;
  }

  private resolveChooseEnergyRaw(prompt: ChooseEnergyPrompt): number[] | null {
    const selected: number[] = [];
    for (let i = 0; i < prompt.energy.length; i++) {
      selected.push(i);
      const energy = selected.map(index => prompt.energy[index]);
      if (prompt.validate(energy)) {
        return selected;
      }
    }
    return prompt.options.allowCancel ? null : selected;
  }

  private resolveChoosePrizeRaw(state: State, prompt: ChoosePrizePrompt): number[] | null {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    const targetPlayer = prompt.options.useOpponentPrizes ? opponent : player;
    if (!targetPlayer) {
      return null;
    }
    const result: number[] = [];
    for (let i = 0; i < targetPlayer.prizes.length && result.length < prompt.options.count; i++) {
      if (targetPlayer.prizes[i].cards.length > 0 && !prompt.options.blocked.includes(i)) {
        result.push(i);
      }
    }
    return result;
  }

  private resolvePutDamageRaw(prompt: PutDamagePrompt): any {
    const target = prompt.maxAllowedDamage.find(item => item.damage >= prompt.damage);
    if (target) {
      return [{ target: target.target, damage: prompt.damage }];
    }
    return prompt.options.allowCancel ? null : [];
  }

  private resolveDamageTransferRaw(prompt: MoveDamagePrompt | RemoveDamagePrompt): any {
    const from = prompt.maxAllowedDamage.find(item => !prompt.options.blockedFrom.some(blocked => this.toTargetKey(blocked) === this.toTargetKey(item.target)));
    const to = prompt.maxAllowedDamage.find(item => !prompt.options.blockedTo.some(blocked => this.toTargetKey(blocked) === this.toTargetKey(item.target)));
    if (from && to) {
      return [{ from: from.target, to: to.target }];
    }
    return prompt.options.allowCancel ? null : [];
  }

  private resolveDiscardEnergyRaw(state: State, prompt: DiscardEnergyPrompt): any {
    const promptPlayers = this.getPromptPlayers(state, prompt);
    if (!promptPlayers) {
      return null;
    }
    const { player, opponent } = promptPlayers;
    const result: { from: CardTarget; index: number }[] = [];
    const max = prompt.options.max ?? Infinity;
    for (const source of this.buildTargets(player, opponent, prompt.playerType, prompt.slots, prompt.options.blockedFrom)) {
      const cardList = source.player === PlayerType.BOTTOM_PLAYER
        ? (source.slot === SlotType.ACTIVE ? player.active : player.bench[source.index])
        : (source.slot === SlotType.ACTIVE ? opponent.active : opponent.bench[source.index]);
      for (let i = 0; i < cardList.cards.length && result.length < max; i++) {
        const card = cardList.cards[i];
        if (card.superType === SuperType.ENERGY && this.cardMatchesPartialFilter(card, prompt.filter)) {
          result.push({ from: source, index: i });
        }
      }
    }
    if (result.length < prompt.options.min) {
      return prompt.options.allowCancel ? null : [];
    }
    return result;
  }
}
