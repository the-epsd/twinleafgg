"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsReshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class NsReshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 130;
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powerful Rage',
                cost: [R, L],
                damage: 20,
                text: 'This attack does 20 damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Raging Hammer',
                cost: [R, R, L, C],
                damage: 170,
                text: ''
            },
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '74';
        this.name = 'N\'s Reshiram';
        this.fullName = 'N\'s Reshiram SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            effect.damage = player.active.damage * 2;
        }
        return state;
    }
}
exports.NsReshiram = NsReshiram;
