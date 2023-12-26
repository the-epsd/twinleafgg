"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
class Snorlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.regulationMark = 'F';
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Unfazed Fat',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
            }];
        this.attacks = [{
                name: 'Thumping Snore',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'This Pokémon is now Asleep. During Pokémon Checkup, flip 2 coins instead of 1. If either of them is tails, this Pokémon is still Asleep.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.name = 'Snorlax';
        this.fullName = 'Snorlax LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            const player = effect.player;
            specialConditionEffect.target = effect.player.active;
            store.reduceEffect(state, specialConditionEffect);
            let coin1Result = false;
            let coin2Result = false;
            store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), (result) => {
                coin1Result = result;
            });
            store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), (result) => {
                coin2Result = result;
            });
            if (coin1Result && coin2Result) {
                // Create effect to remove Asleep
                const removeAsleep = new attack_effects_1.RemoveSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
                removeAsleep.target = player.active;
                // Reduce effect to remove Asleep
                state = store.reduceEffect(state, removeAsleep);
                return state;
            }
        }
        // Prevent damage effects
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = state_utils_1.StateUtils.findOwner(state, effect.target);
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Snorlax = Snorlax;
