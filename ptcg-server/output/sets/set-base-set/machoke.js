"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Machoke';
        this.set = 'BS';
        this.fullName = 'Machoke BS';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Karate Chop',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Does 50 damage minus 10 damage for each damage counter on Machoke.'
            },
            {
                name: 'Submission',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Machoke does 20 damage to itself.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const damage = Math.max(50 - player.active.damage, 0);
            effect.damage = damage;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const damage = new attack_effects_1.DealDamageEffect(effect, 20);
            damage.target = effect.player.active;
            store.reduceEffect(state, damage);
        }
        return state;
    }
}
exports.Machoke = Machoke;
