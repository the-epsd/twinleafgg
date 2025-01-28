"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsKlang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class NsKlang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'N\'s Klink';
        this.cardType = M;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Twirling Gear',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            { name: 'Confront', cost: [M, C], damage: 40, text: '' },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'N\'s Klang';
        this.fullName = 'N\'s Klang SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        return state;
    }
}
exports.NsKlang = NsKlang;
