"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoopa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_3 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Hoopa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Scoundrel Guard',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s Pokémon-GX or Pokémon-EX.'
            }];
        this.attacks = [
            {
                name: 'Super Psy Bolt',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'SLG';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hoopa';
        this.fullName = 'Hoopa SLG';
    }
    reduceEffect(store, state, effect) {
        // Scoundrel Guard
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_3.StateUtils.findOwner(state, effect.target);
            const opponent = game_3.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_2.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_EX) || sourceCard.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
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
exports.Hoopa = Hoopa;
