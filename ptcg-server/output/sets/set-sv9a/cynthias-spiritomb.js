"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasSpiritomb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CynthiasSpiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Raging Curse',
                cost: [C],
                damage: 10,
                damageCalculator: 'x',
                text: 'This attack does 10 damage for each damage counter on all your Benched Cynthia\'s Pokemon. Don\'t apply Weakness for this attack\'s damage.',
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Spiritomb';
        this.fullName = 'Cynthia\'s Spiritomb SV9a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let totalDamage = 0;
            player.bench.forEach(pokemon => {
                if (pokemon.cards.some(card => card.tags.includes(card_types_1.CardTag.CYNTHIAS))) {
                    totalDamage += pokemon.damage;
                }
            });
            effect.damage = totalDamage;
            effect.ignoreWeakness = true;
            return state;
        }
        return state;
    }
}
exports.CynthiasSpiritomb = CynthiasSpiritomb;
