"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rolycoly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Rolycoly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Reckless Charge',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'This Pokemon also does 10 damage to itself.'
            }
        ];
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Rolycoly';
        this.fullName = 'Rolycoly BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Rolycoly = Rolycoly;
