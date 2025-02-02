"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morpeko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Morpeko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Explosive Discontent',
                cost: [card_types_1.CardType.DARK],
                damage: 30,
                text: 'This attack does 30 damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.name = 'Morpeko';
        this.fullName = 'Morpeko FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage = effect.player.active.damage * 30;
            return state;
        }
        return state;
    }
}
exports.Morpeko = Morpeko;
