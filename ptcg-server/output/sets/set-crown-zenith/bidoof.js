"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bidoof = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Bidoof extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Carefree Countenance',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is on your Bench, prevent all ' +
                    'damage done to this Pokemon by attacks (both yours and ' +
                    'your opponent\'s).'
            }];
        this.attacks = [{
                name: 'Hyper Fang',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Bidoof';
        this.fullName = 'Bidoof CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
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
            // Target is this Bidoof
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_b) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Bidoof = Bidoof;
