"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golbat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Golbat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.evolvesFrom = 'Zubat';
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C, C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Leech Life',
                cost: [G, G, C],
                damage: 20,
                text: 'Remove a number of damage counters from Golbat equal to the damage done to the Defending Pokémon (after applying Weakness and Resistance). If Golbat has fewer damage counters than that, remove all of them.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Golbat';
        this.fullName = 'Golbat FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const target = player.active;
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, 20);
            damageEffect.target = effect.target;
            state = store.reduceEffect(state, damageEffect);
            const damageToHeal = damageEffect.damage;
            // Heal damage
            const healEffect = new game_effects_1.HealEffect(player, target, damageToHeal);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Golbat = Golbat;
