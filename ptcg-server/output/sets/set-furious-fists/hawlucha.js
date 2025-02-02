"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hawlucha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
class Hawlucha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Shining Spirit',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Damage from this Pokémon\'s attacks isn\'t affected by ' +
                    'Weakness or Resistance.'
            }];
        this.attacks = [{
                name: 'Flying Press',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 60,
                text: 'If your opponent\'s Active Pokemon isn\'t a Pokemon-EX, ' +
                    'this attack does nothing.'
            }];
        this.set = 'FFI';
        this.name = 'Hawlucha';
        this.fullName = 'Hawlucha FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (!defending || !defending.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                effect.damage = 0;
                return state;
            }
            // Ability - ignore weakness and resistance for this attack.
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Hawlucha = Hawlucha;
