"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Butterfree = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Butterfree extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.evolvesFrom = 'Metapod';
        this.attacks = [{
                name: 'Whirlwind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
            },
            {
                name: 'Mega Drain',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 40,
                text: 'Remove a number of damage counters from Butterfree equal to half the damage done to the Defending Pokémon (after applying Weakness and Resistance) (rounded up to the nearest 10).'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Butterfree';
        this.fullName = 'Butterfree JU';
        this.USED_WHIRLWIND = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.USED_WHIRLWIND = true;
        }
        if (effect instanceof attack_effects_1.AfterDamageEffect && this.USED_WHIRLWIND == true) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                    return state;
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.USED_WHIRLWIND == true) {
            this.USED_WHIRLWIND = false;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const target = player.active;
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, 40);
            damageEffect.target = effect.target;
            state = store.reduceEffect(state, damageEffect);
            const damageToHeal = damageEffect.damage / 2;
            // rounding to nearest 10
            const damageToHealLow = (damageToHeal / 10) * 10;
            const damageToHealHigh = damageToHealLow + 10;
            const heal = (damageToHeal - damageToHealLow >= damageToHealHigh - damageToHeal) ? damageToHealHigh : damageToHealLow;
            // Heal damage
            const healEffect = new game_effects_1.HealEffect(player, target, heal);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Butterfree = Butterfree;
