"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggcute = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Exeggcute extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hypnosis',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Exeggcute.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Exeggcute';
        this.fullName = 'Exeggcute JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const target = player.active;
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, 40);
            damageEffect.target = effect.target;
            state = store.reduceEffect(state, damageEffect);
            if (damageEffect.damage > 0) {
                const healEffect = new game_effects_1.HealEffect(player, target, 10);
                state = store.reduceEffect(state, healEffect);
            }
            return state;
        }
        return state;
    }
}
exports.Exeggcute = Exeggcute;
