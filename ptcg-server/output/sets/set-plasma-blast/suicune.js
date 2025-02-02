"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suicune = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_3 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Suicune extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Safeguard',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon by Pokémon-EX.'
            }];
        this.attacks = [{ name: 'Aurora Beam', cost: [W, C, C], damage: 70, text: '' }];
        this.set = 'PLB';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Suicune';
        this.fullName = 'Suicune PLB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined)
                return state;
            const player = game_3.StateUtils.findOwner(state, effect.target);
            if (state.phase !== game_2.GamePhase.ATTACK)
                return state;
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_EX) && !prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                effect.preventDefault = true;
        }
        return state;
    }
}
exports.Suicune = Suicune;
