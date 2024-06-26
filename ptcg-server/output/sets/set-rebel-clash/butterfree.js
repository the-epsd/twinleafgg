"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Butterfree = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Butterfree extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metapod';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Panic Poison',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Burned, Confused, and Poisoned.'
            },
            {
                name: 'Cutting Wind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            },
        ];
        this.set = 'RCL';
        this.name = 'Butterfree';
        this.fullName = 'Butterfree RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
        }
        return state;
    }
}
exports.Butterfree = Butterfree;
