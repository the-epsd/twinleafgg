"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlappleVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
class FlappleVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Flapple V';
        this.regulationMark = 'E';
        this.tags = [card_types_2.CardTag.POKEMON_VMAX];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'G-Max Rolling',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'This attack does 10 less damage for each damage counter ' +
                    'on this Pokémon.'
            }];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Flapple VMAX';
        this.fullName = 'Flapple VMAX BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage -= effect.player.active.damage;
            return state;
        }
        return state;
    }
}
exports.FlappleVMAX = FlappleVMAX;
