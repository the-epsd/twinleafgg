"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morpeko = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Morpeko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.regulationMark = 'D';
        this.attacks = [{
                name: 'Attack the Wound',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 50 more damage.'
            }];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Morpeko';
        this.fullName = 'Morpeko SSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 50;
            }
            return state;
        }
        return state;
    }
}
exports.Morpeko = Morpeko;
