"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golisopod = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Golisopod extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wimpod';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powerful Cross',
                cost: [W],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each card in your opponent\'s hand.'
            },
            {
                name: 'Waterfall',
                cost: [W, W, C],
                damage: 130,
                text: ''
            },
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Golisopod';
        this.fullName = 'Golisopod PAR';
    }
    reduceEffect(store, state, effect) {
        // Powerful Cross
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage = (20 * opponent.hand.cards.length);
        }
        return state;
    }
}
exports.Golisopod = Golisopod;
