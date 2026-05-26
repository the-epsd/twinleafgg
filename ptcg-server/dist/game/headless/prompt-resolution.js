import { SuperType } from '../store/card/card-types';
import { PlayerType, SlotType } from '../store/actions/play-card-action';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { AttachEnergyPrompt } from '../store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../store/prompts/choose-cards-prompt';
import { ChooseEnergyPrompt } from '../store/prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../store/prompts/choose-prize-prompt';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { ConfirmCardsPrompt } from '../store/prompts/confirm-cards-prompt';
import { ConfirmPrompt } from '../store/prompts/confirm-prompt';
import { DiscardEnergyPrompt } from '../store/prompts/discard-energy-prompt';
import { MoveDamagePrompt } from '../store/prompts/move-damage-prompt';
import { MoveEnergyPrompt } from '../store/prompts/move-energy-prompt';
import { OrderCardsPrompt } from '../store/prompts/order-cards-prompt';
import { PutDamagePrompt } from '../store/prompts/put-damage-prompt';
import { SelectOptionPrompt } from '../store/prompts/select-option-prompt';
import { SelectPrompt } from '../store/prompts/select-prompt';
import { ShowMulliganPrompt } from '../store/prompts/show-mulligan-prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { WaitPrompt } from '../store/prompts/wait-prompt';
import { AlertPrompt } from '../store/prompts/alert-prompt';
import { ShowCardsPrompt } from '../store/prompts/show-cards-prompt';
import { ConfirmCardsPrompt as ConfirmCardsPromptClass } from '../store/prompts/confirm-cards-prompt';
export class HeadlessPromptResolver {
    constructor() {
        this.overrides = new Map();
    }
    overrideOnce(promptType, handler) {
        this.overrides.set(promptType, handler);
    }
    resolve(state, prompt) {
        const override = this.overrides.get(prompt.type);
        if (override) {
            this.overrides.delete(prompt.type);
            return this.toAction(state, prompt, override(prompt, state));
        }
        return this.toAction(state, prompt, this.defaultRawResult(state, prompt));
    }
    toAction(state, prompt, rawResult) {
        const decoded = prompt.decode(rawResult, state);
        if (prompt.validate(decoded, state) === false) {
            throw new Error(`[headless] Invalid prompt result for "${prompt.type}": ${JSON.stringify(rawResult)}`);
        }
        return new ResolvePromptAction(prompt.id, decoded);
    }
    defaultRawResult(state, prompt) {
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
        if (prompt instanceof ChooseCardsPrompt) {
            return this.resolveChooseCardsRaw(prompt);
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
        if (prompt instanceof SelectPrompt || prompt instanceof SelectOptionPrompt) {
            return 0;
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
        if (prompt instanceof MoveDamagePrompt || prompt instanceof MoveEnergyPrompt) {
            return prompt.options.allowCancel ? null : [];
        }
        if (prompt instanceof DiscardEnergyPrompt) {
            return this.resolveDiscardEnergyRaw(state, prompt);
        }
        return true;
    }
    resolveShuffleRaw(state, prompt) {
        const player = state.players.find(p => p.id === prompt.playerId);
        return player ? player.deck.cards.map((_, index) => index) : [];
    }
    resolveChooseCardsRaw(prompt) {
        const blocked = new Set(prompt.options.blocked);
        const indices = [];
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
    getPromptPlayers(state, prompt) {
        const player = state.players.find(p => p.id === prompt.playerId);
        const opponent = state.players.find(p => p.id !== prompt.playerId);
        return player && opponent ? { player, opponent } : undefined;
    }
    toTargetKey(target) {
        return `${target.player}-${target.slot}-${target.index}`;
    }
    resolveChoosePokemonRaw(state, prompt) {
        const promptPlayers = this.getPromptPlayers(state, prompt);
        if (!promptPlayers) {
            return null;
        }
        const blockedSet = new Set(prompt.options.blocked.map(target => this.toTargetKey(target)));
        const targets = [];
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
    cardMatchesPartialFilter(card, filter) {
        for (const key in filter) {
            if (card[key] !== filter[key]) {
                return false;
            }
        }
        return true;
    }
    resolveAttachEnergyRaw(state, prompt) {
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
    buildTargets(player, opponent, playerType, slots, blocked) {
        const blockedSet = new Set(blocked.map(target => this.toTargetKey(target)));
        const result = [];
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
    resolveChooseEnergyRaw(prompt) {
        const selected = [];
        for (let i = 0; i < prompt.energy.length; i++) {
            selected.push(i);
            const energy = selected.map(index => prompt.energy[index]);
            if (prompt.validate(energy)) {
                return selected;
            }
        }
        return prompt.options.allowCancel ? null : selected;
    }
    resolveChoosePrizeRaw(state, prompt) {
        const player = state.players.find(p => p.id === prompt.playerId);
        const opponent = state.players.find(p => p.id !== prompt.playerId);
        const targetPlayer = prompt.options.useOpponentPrizes ? opponent : player;
        if (!targetPlayer) {
            return null;
        }
        const result = [];
        for (let i = 0; i < targetPlayer.prizes.length && result.length < prompt.options.count; i++) {
            if (targetPlayer.prizes[i].cards.length > 0 && !prompt.options.blocked.includes(i)) {
                result.push(i);
            }
        }
        return result;
    }
    resolvePutDamageRaw(prompt) {
        const target = prompt.maxAllowedDamage.find(item => item.damage >= prompt.damage);
        if (target) {
            return [{ target: target.target, damage: prompt.damage }];
        }
        return prompt.options.allowCancel ? null : [];
    }
    resolveDiscardEnergyRaw(state, prompt) {
        var _a;
        const promptPlayers = this.getPromptPlayers(state, prompt);
        if (!promptPlayers) {
            return null;
        }
        const { player, opponent } = promptPlayers;
        const result = [];
        const max = (_a = prompt.options.max) !== null && _a !== void 0 ? _a : Infinity;
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
