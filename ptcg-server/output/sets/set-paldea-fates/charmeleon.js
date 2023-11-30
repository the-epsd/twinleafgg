"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Charmeleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Flare Veil',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks used by your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
            }];
        this.attacks = [
            {
                name: 'Raging Flames',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 60,
                text: 'Discard the top 3 cards of your deck.'
            }
        ];
        this.regulationMark = 'G';
        this.set2 = 'shinytreasuresex';
        this.setNumber = '26';
        this.set = 'SV4';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon SV4';
    }
    reduceEffect(store, state, effect) {
        // Prevent damage from Pokemon-EX
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // pokemon is evolved
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard) {
                // eslint-disable-next-line indent
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
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
exports.Charmeleon = Charmeleon;
