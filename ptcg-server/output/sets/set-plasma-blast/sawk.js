"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sawk = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sawk extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Kick of Righteousness',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Team Plasma Pokémon, this attack does 40 more damage.'
            },
            { name: 'Low Sweep', cost: [F, C, C], damage: 60, text: '' },
        ];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Sawk';
        this.fullName = 'Sawk PLB';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 40, game_1.CardTag.TEAM_PLASMA);
        }
        return state;
    }
}
exports.Sawk = Sawk;
