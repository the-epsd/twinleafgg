"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeedrillTEU = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class BeedrillTEU extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kakuna';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'TEU';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill TEU';
        this.attacks = [
            {
                name: 'Destiny Stinger',
                cost: [game_1.CardType.GRASS],
                damage: 0,
                text: 'You can use this attack only if this Pokemon has any damage counters on it. Both Active Pokemon are Knocked Out.'
            },
            {
                name: 'Reckless Charge',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 90,
                text: 'This Pokemon does 10 damage to itself.'
            },
        ];
    }
    reduceEffect(store, state, effect) {
        // Destiny Stinger
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            // If no damage counters on ourself, can't use the attack.
            if (cardList.damage <= 0) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            // Knock out both active Pokemon, the dumb way.
            player.active.damage += 999;
            opponent.active.damage += 999;
        }
        // Reckless Charge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.BeedrillTEU = BeedrillTEU;
