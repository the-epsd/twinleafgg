"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineBlindside = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TechnicalMachineBlindside extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '176';
        this.name = 'Technical Machine: Blindside';
        this.fullName = 'Technical Machine: Blindside PAR';
        this.attacks = [{
                name: 'Blindside',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only when your opponent has exactly 1 Prize card remaining.'
            }];
        this.text = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_b) {
                return state;
            }
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.tool) {
            const player = effect.player;
            const tool = effect.player.active.tool;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_c) {
                return state;
            }
            if (tool.name === this.name) {
                player.active.moveCardTo(tool, player.discard);
                player.active.tool = undefined;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_d) {
                return state;
            }
            const blocked = [];
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                effect.damage = 120;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage == 0) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                }
                if (cardList.damage > 0) {
                    return state;
                }
                else {
                    blocked.push(target);
                }
            });
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked: blocked }), target => {
                if (!target || target.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                damageEffect.target = target[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.TechnicalMachineBlindside = TechnicalMachineBlindside;
