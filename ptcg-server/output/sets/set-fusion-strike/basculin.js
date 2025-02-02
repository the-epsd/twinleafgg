"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basculin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Basculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Swarm the Wound',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 10 more damage for each damage counter on your opponent\'s Active Pokémon.'
            },
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Basculin';
        this.fullName = 'Basculin FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += opponent.active.damage;
            return state;
        }
        return state;
    }
}
exports.Basculin = Basculin;
