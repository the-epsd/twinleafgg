"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shaymin = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Shaymin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Flower Curtain',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokémon without a Rule Box by attacks from your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Smash Kick',
                cost: [C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin SV9a';
    }
    reduceEffect(store, state, effect) {
        // Flower Curtain
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            let isShayminInPlay = false;
            targetPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isShayminInPlay = true;
                }
            });
            if (!isShayminInPlay) {
                return state;
            }
            if (effect.target.hasRuleBox()) {
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
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Shaymin = Shaymin;
