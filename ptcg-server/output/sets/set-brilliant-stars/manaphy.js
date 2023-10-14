"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manaphy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Manaphy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wave Veil',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokémon by ' +
                    'attacks from your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }];
        this.set = 'BRS';
        this.set2 = 'brilliantstars';
        this.setNumber = '41';
        this.name = 'Manaphy';
        this.fullName = 'Manaphy BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            let isManaphyInPlay = false;
            targetPlayer.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isManaphyInPlay = true;
                }
            });
            if (!isManaphyInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Manaphy = Manaphy;
