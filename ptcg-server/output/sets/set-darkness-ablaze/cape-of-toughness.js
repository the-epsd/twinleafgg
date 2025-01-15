"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapeOfToughness = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CapeOfToughness extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.name = 'Cape of Toughness';
        this.fullName = 'Cape of Toughness DAA';
        this.text = 'The Basic Pokémon this card is attached to gets +50 HP, except Pokémon-GX.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const card = effect.target.getPokemonCard();
            if (card === undefined) {
                return state;
            }
            if (card.stage === card_types_1.Stage.BASIC && !card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                effect.hp += 50;
            }
        }
        return state;
    }
}
exports.CapeOfToughness = CapeOfToughness;
