"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyrogue = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Tyrogue extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 30;
        this.retreat = [];
        this.powers = [{
                name: 'Sweet Sleeping Face',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Tyrogue is Asleep, prevent all damage done to Tyrogue ' +
                    'by attacks.'
            }];
        this.attacks = [
            {
                name: 'Mischievous Punch',
                cost: [],
                damage: 30,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. ' +
                    'Tyrogue is now Asleep.'
            }
        ];
        this.set = 'HS';
        this.name = 'Tyrogue';
        this.fullName = 'Tyrogue HGSS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
            specialCondition.target = player.active;
            store.reduceEffect(state, specialCondition);
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            if (effect.target.cards.includes(this)) {
                const pokemonCard = effect.target.getPokemonCard();
                const isAsleep = effect.target.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP);
                if (pokemonCard === this && isAsleep) {
                    // Try to reduce PowerEffect, to check if something is blocking our ability
                    try {
                        const stub = new game_effects_1.PowerEffect(effect.player, {
                            name: 'test',
                            powerType: game_1.PowerType.ABILITY,
                            text: ''
                        }, this);
                        store.reduceEffect(state, stub);
                    }
                    catch (_a) {
                        return state;
                    }
                    effect.preventDefault = true;
                }
            }
        }
        return state;
    }
}
exports.Tyrogue = Tyrogue;
