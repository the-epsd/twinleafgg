"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragalge = void 0;
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class Dragalge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skrelp';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Poison Barrier',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Your opponent\'s Poisoned Pokemon can\'t retreat.'
            }];
        this.attacks = [{
                name: 'Poison Breath',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokemon ' +
                    'is now Poisoned.'
            }];
        this.set = 'FLF';
        this.name = 'Dragalge';
        this.fullName = 'Dragalge FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        // Block retreat for opponent's poisoned Pokemon.
        if (effect instanceof game_effects_1.RetreatEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const isPoisoned = player.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED);
            if (!isPoisoned) {
                return state;
            }
            let isDragalgeInPlay = false;
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isDragalgeInPlay = true;
                }
            });
            if (isDragalgeInPlay) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Dragalge = Dragalge;
