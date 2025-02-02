"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsCramorant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class HopsCramorant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOPS];
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Fickle Spit',
                cost: [C],
                damage: 120,
                text: 'If your opponent doesn\'t have exactly 3 or 4 Prize cards remaining, this attack does nothing.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Hop\'s Cramorant';
        this.fullName = 'Hop\'s Cramorant SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() !== 3 && opponent.getPrizeLeft() !== 4) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.HopsCramorant = HopsCramorant;
