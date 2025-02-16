"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasGible = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CynthiasGible extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Rock Hurl',
                cost: [F],
                damage: 20,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Gible';
        this.fullName = 'Cynthia\'s Gible SV9a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.CynthiasGible = CynthiasGible;
