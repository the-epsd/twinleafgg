"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zeraora = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Zeraora extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Battle Claw',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 30 more damage.'
            },
            {
                name: 'Mach Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Zeraora';
        this.fullName = 'Zeraora SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.isBasic()) {
                return state;
            }
            else {
                effect.damage += 30;
            }
            return state;
        }
        return state;
    }
}
exports.Zeraora = Zeraora;
