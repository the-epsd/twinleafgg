"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drednaw = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drednaw extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.cardType = game_1.CardType.WATER;
        this.hp = 140;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.evolvesFrom = 'Chewtle';
        this.powers = [{
                name: 'Impervious Shell',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon if that damage is 200 or more.'
            }];
        this.attacks = [{
                name: 'Hard Crunch',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 80 more damage.'
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Drednaw';
        this.fullName = 'Drednaw SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this) && effect.damage >= 200) {
            effect.damage = 0;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active;
            if (opponentActive.damage > 0) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Drednaw = Drednaw;
