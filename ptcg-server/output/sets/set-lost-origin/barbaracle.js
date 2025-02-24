"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barbaracle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Barbaracle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Binacle';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Lost Block',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Your opponent puts any Prize cards they would take in the Lost Zone instead of into their hand.'
            }
        ];
        this.attacks = [
            {
                name: 'Dynamic Chop',
                cost: [F, C, C],
                damage: 100,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.setNumber = '107';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Barbaracle';
        this.fullName = 'Barbaracle LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPrizesDestinationEffect && state_utils_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            // Ensure that Barbaracle is in play and has an owner.
            const opponent = effect.player; // Since it's the opponent that draws the prizes
            const player = state_utils_1.StateUtils.getOpponent(state, opponent);
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            // Check if ability is blocked
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            // If the DrawPrizesEffect is triggering on the opponent's prize draw, override the destination.
            if (effect.player.id === opponent.id) {
                effect.destination = opponent.lostzone;
            }
        }
        return state;
    }
}
exports.Barbaracle = Barbaracle;
