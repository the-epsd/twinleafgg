"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeedleTEU = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class WeedleTEU extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'TEU';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weedle';
        this.fullName = 'Weedle TEU';
        this.attacks = [
            {
                name: 'Reckless Charge',
                cost: [game_1.CardType.COLORLESS],
                damage: 20,
                text: 'This Pokemon does 10 damage to itself.'
            },
        ];
    }
    reduceEffect(store, state, effect) {
        // Reckless Charge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.WeedleTEU = WeedleTEU;
