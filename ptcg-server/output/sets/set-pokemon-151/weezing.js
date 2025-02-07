"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weezing = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weezing extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Koffing';
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Let\'s Have a Blast',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your ' +
                    'opponent\'s Pokémon, flip a coin. If heads, the Attacking Pokémon is Knocked Out.'
            }];
        this.attacks = [
            {
                name: 'Spinning Fumes',
                cost: [C, C],
                damage: 50,
                text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Weezing';
        this.fullName = 'Weezing MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect &&
            effect.target.getPokemonCard() === this &&
            effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn, or if abilities are blocked.
            if (state.phase !== game_1.GamePhase.ATTACK ||
                player.active.getPokemonCard() !== this ||
                state.players[state.activePlayer] !== opponent ||
                prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                return state;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, (result) => {
                if (!result)
                    return;
                const dealDamage = new game_effects_1.KnockOutEffect(opponent, opponent.active);
                store.reduceEffect(state, dealDamage);
                return prefabs_1.TAKE_X_PRIZES(store, state, player, dealDamage.prizeCount);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Weezing = Weezing;
