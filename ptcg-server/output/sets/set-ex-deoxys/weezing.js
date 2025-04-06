"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weezing = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Weezing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Koffing';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Liability',
                cost: [C],
                damage: 0,
                text: 'Put damage counters on the Defending Pokémon until it is 10 HP away from being Knocked Out. Weezing does 70 damage to itself.'
            },
            {
                name: 'Smogscreen',
                cost: [G, C],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned. If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
            }];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Weezing';
        this.fullName = 'Weezing DX';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const selectedTarget = opponent.active;
            const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
            store.reduceEffect(state, checkHpEffect);
            const totalHp = checkHpEffect.hp;
            let damageAmount = totalHp - 10;
            // Adjust damage if the target already has damage
            const targetDamage = selectedTarget.damage;
            if (targetDamage > 0) {
                damageAmount = Math.max(0, damageAmount - targetDamage);
            }
            if (damageAmount > 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
            else if (damageAmount <= 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 0);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 70);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
            prefabs_1.ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && prefabs_1.HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_a) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (!coinFlipResult) {
                //effect.damage = 0;
                effect.preventDefault = true;
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (prefabs_1.HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
                prefabs_1.REMOVE_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this);
            }
        }
        return state;
    }
}
exports.Weezing = Weezing;
