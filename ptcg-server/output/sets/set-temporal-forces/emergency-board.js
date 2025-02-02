"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyBoard = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class EmergencyBoard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Rescue Board';
        this.fullName = 'Rescue Board TEF';
        this.text = 'The Retreat Cost of the Pokémon this card is attached to is [C] less. If that Pokémon\'s remaining HP is 30 or less, it has no Retreat Cost.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                const remainingHp = pokemonCard.hp - player.active.damage;
                if (remainingHp <= 30) {
                    effect.cost = [];
                }
                else {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.EmergencyBoard = EmergencyBoard;
