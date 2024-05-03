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
        this.hp = 0;
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.marker = new card_marker_1.Marker();
        this.attackMarker = new card_marker_1.Marker();
        this.abilityMarker = new card_marker_1.Marker();
        this.pokemonPlayedTurn = 0;
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
        this.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.KNOCKOUT_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.CLEAR_KNOCKOUT_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
        this.attackMarker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES);
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
            card_types_1.SpecialCondition.ASLEEP,
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
PokemonCardList.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
PokemonCardList.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
PokemonCardList.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
PokemonCardList.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES';
