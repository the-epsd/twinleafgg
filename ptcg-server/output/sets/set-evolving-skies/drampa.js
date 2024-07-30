"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drampa = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drampa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 120;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Corkscrew Punch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Berserk',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.FIGHTING],
                damage: 70,
                damageCalculation: '+',
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 90 more damage.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Drampa';
        this.fullName = 'Drampa EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const hasBenchDamage = player.bench.some(cardList => cardList.damage > 0);
            if (hasBenchDamage) {
                effect.damage += 90;
            }
            return state;
        }
        return state;
    }
}
exports.Drampa = Drampa;
