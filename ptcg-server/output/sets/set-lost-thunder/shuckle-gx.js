"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuckleGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_effects_2 = require("../../game/store/effects/game-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class ShuckleGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Protective Shell',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon that have 2 or fewer Energy attached to them.'
            }];
        this.attacks = [
            {
                name: 'Triple Poison',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 3 damage counters instead of 1 on that Pokémon between turns. '
            },
            {
                name: 'Wrap-GX',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                gxAttack: true,
                text: 'Your opponent\'s Active Pokémon is now Paralyzed. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shuckle-GX';
        this.fullName = 'Shuckle-GX LOT';
    }
    reduceEffect(store, state, effect) {
        // Protective Shell
        if (effect instanceof attack_effects_2.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_2.StateUtils.findOwner(state, effect.target);
            const opponent = game_2.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Checking if the opponent has more than 2 energy attached
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            if (opponentEnergyCount > 2) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
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
        // Triple Poison
        if (effect instanceof game_effects_2.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 30;
            return store.reduceEffect(state, specialCondition);
        }
        // Wrap-GX
        if (effect instanceof game_effects_2.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.PARALYZED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.ShuckleGX = ShuckleGX;
