"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duraludon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Duraludon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Hammer In',
                cost: [M],
                damage: 30,
                text: ''
            },
            {
                name: 'Raging Hammer',
                cost: [M, M, C],
                damage: 80,
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
        ];
        this.regulationMark = 'H';
        this.setNumber = '106';
        this.set = 'SCR';
        this.name = 'Duraludon';
        this.fullName = 'Duraludon SCR';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            effect.damage += player.active.damage;
        }
        return state;
    }
}
exports.Duraludon = Duraludon;
