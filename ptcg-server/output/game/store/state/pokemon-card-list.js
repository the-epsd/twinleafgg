"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCardList = void 0;
const card_list_1 = require("./card-list");
const card_marker_1 = require("./card-marker");
const card_types_1 = require("../card/card-types");
const pokemon_card_1 = require("../card/pokemon-card");
class PokemonCardList extends card_list_1.CardList {
    constructor() {
        super(...arguments);
        this.damage = 0;
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.marker = new card_marker_1.Marker();
        this.attackMarker = new card_marker_1.Marker();
        this.abilityMarker = new card_marker_1.Marker();
        this.pokemonPlayedTurn = 0;
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
    }
    getPokemons() {
        const result = [];
        for (const card of this.cards) {
            if (card.superType === card_types_1.SuperType.POKEMON && card !== this.tool) {
                result.push(card);
            }
        }
        return result;
    }
    getPokemonCard() {
        const pokemons = this.getPokemons();
        if (pokemons.length > 0) {
            return pokemons[pokemons.length - 1];
        }
    }
    isBasic() {
        const pokemons = this.getPokemons();
        if (pokemons.length !== 1) {
            return false;
        }
        return pokemons[0].stage === card_types_1.Stage.BASIC;
    }
    clearAttackEffects() {
        this.marker.markers = [];
    }
    clearEffects() {
        this.marker.removeMarker(this.ATTACK_USED_MARKER);
        this.marker.markers = [];
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        if (this.cards.length === 0) {
            this.damage = 0;
        }
        if (this.tool && !this.cards.includes(this.tool)) {
            this.tool = undefined;
        }
    }
    removeSpecialCondition(sp) {
        if (!this.specialConditions.includes(sp)) {
            return;
        }
        this.specialConditions = this.specialConditions
            .filter(s => s !== sp);
    }
    addSpecialCondition(sp) {
        if (sp === card_types_1.SpecialCondition.POISONED) {
            this.poisonDamage = 10;
        }
        if (sp === card_types_1.SpecialCondition.BURNED) {
            this.burnDamage = 20;
        }
        if (this.specialConditions.includes(sp)) {
            return;
        }
        if (sp === card_types_1.SpecialCondition.POISONED || sp === card_types_1.SpecialCondition.BURNED) {
            this.specialConditions.push(sp);
            return;
        }
        this.specialConditions = this.specialConditions.filter(s => [
            card_types_1.SpecialCondition.PARALYZED,
            card_types_1.SpecialCondition.CONFUSED,
            card_types_1.SpecialCondition.ASLEEP
        ].includes(s) === false);
        this.specialConditions.push(sp);
    }
    hasRuleBox() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_ex) || c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR));
    }
    vPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR));
    }
    getToolEffect() {
        if (!this.tool) {
            return;
        }
        const toolCard = this.tool.cards;
        if (toolCard instanceof pokemon_card_1.PokemonCard) {
            return toolCard.powers[0] || toolCard.attacks[0];
        }
        return;
    }
}
exports.PokemonCardList = PokemonCardList;
