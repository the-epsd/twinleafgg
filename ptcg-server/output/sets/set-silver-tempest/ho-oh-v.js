"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoOhV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class HoOhV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 230;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Reviving Flame',
                useFromDiscard: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, attach up to 4 basic Energy cards from your discard pile to this Pokémon. If you use this Ability, your turn ends.',
            }];
        this.attacks = [{
                name: 'Rainbow Burn',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each type of basic Energy attached to this Pokémon.',
            }];
        this.set = 'SVT';
        this.name = 'Ho-Oh V';
        this.fullName = 'Ho-Oh V SVT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '001';
    }
    reduceEffect(store, state, effect) {
        return super.reduceEffect(store, state, effect);
    }
}
exports.HoOhV = HoOhV;
