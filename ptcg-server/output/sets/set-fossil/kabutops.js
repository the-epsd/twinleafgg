"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kabutops = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kabutops extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kabuto';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sharp Sickle',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 30,
                text: ''
            },
            {
                name: 'Absorb',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 40,
                text: 'Remove a number of damage counters from Kabutops equal to half the damage done to the Defending Pokémon (after applying Weakness and Resistance) (rounded up to the nearest 10). If Kabutops has fewer damage counters than that, remove all of them.'
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Kabutops';
        this.fullName = 'Kabutops FO';
    }
    reduceEffect(store, state, effect) {
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
exports.Kabutops = Kabutops;
