"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regidrago = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Regidrago extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 130;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Hammer In',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Dragon Energy',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.FIRE],
                damage: 240,
                text: 'This attack does 20 less damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Regidrago';
        this.fullName = 'Regidrago EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const damage = Math.max(0, 240 - (player.active.damage / 20));
            effect.damage = damage;
        }
        return state;
    }
}
exports.Regidrago = Regidrago;
