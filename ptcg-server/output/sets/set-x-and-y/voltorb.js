"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voltorb = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Voltorb extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 50;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Destiny Burst',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, flip a coin. If heads, put 5 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Rollout',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = 'XY';
        this.name = 'Voltorb';
        this.fullName = 'Voltorb XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    opponent.active.damage += 50;
                }
            });
        }
        return state;
    }
}
exports.Voltorb = Voltorb;
