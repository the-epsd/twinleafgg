"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsSigilyph = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
class NsSigilyph extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psy Sphere',
                cost: [P],
                damage: 20,
                text: ''
            },
            {
                name: 'Victory Sigil',
                cost: [P, C, C],
                damage: 0,
                text: 'If you have exactly 1 Prize card remaining when using this attack, you win this game.'
            }
        ];
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'N\'s Sigilyph';
        this.fullName = 'N\'s Sigilyph SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.prizes.length === 6) {
                state = check_effect_1.endGame(store, state, player.id);
                return state;
            }
        }
        return state;
    }
}
exports.NsSigilyph = NsSigilyph;
