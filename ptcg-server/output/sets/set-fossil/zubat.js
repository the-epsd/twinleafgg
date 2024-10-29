"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.attacks = [{
                name: 'Supersonic',
                cost: [C, C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Leech Life',
                cost: [G, C],
                damage: 10,
                text: 'Remove a number of damage counters from Zubat equal to the damage done to the Defending Pokémon (after applying Weakness and Resistance). If Zubat has fewer damage counters than that, remove all of them.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Zubat';
        this.fullName = 'Zubat FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const target = player.active;
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, 40);
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
exports.Zubat = Zubat;
