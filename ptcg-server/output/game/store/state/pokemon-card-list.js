"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCardList = void 0;
const card_types_1 = require("../card/card-types");
const pokemon_card_1 = require("../card/pokemon-card");
const card_list_1 = require("./card-list");
const card_marker_1 = require("./card-marker");
class PokemonCardList extends card_list_1.CardList {
    constructor() {
        super(...arguments);
        this.damage = 0;
        this.hp = 0;
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.marker = new card_marker_1.Marker();
        this.pokemonPlayedTurn = 0;
        this.sleepFlips = 1;
        this.boardEffect = [];
        this.stage = card_types_1.Stage.BASIC;
        this.isActivatingCard = false;
    }
    getPokemons() {
        const result = [];
        for (const card of this.cards) {
            if (card.superType === card_types_1.SuperType.POKEMON && card !== this.tool) {
                result.push(card);
            }
            else if (card.name === 'Lillie\'s Poké Doll') {
                result.push(card);
            }
            else if (card.name === 'Clefairy Doll') {
                result.push(card);
            }
            else if (card.name === 'Rare Fossil') {
                result.push(card);
            }
            else if (card.name === 'Robo Substitute') {
                result.push(card);
            }
            else if (card.name === 'Mysterious Fossil') {
                result.push(card);
            }
            else if (card.name === 'Unidentified Fossil') {
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
        this.marker.removeMarker(PokemonCardList.ATTACK_USED_MARKER);
        this.marker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_KNOCKOUT_MARKER);
        this.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
        this.marker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
        this.marker.removeMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
        this.marker.removeMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
        this.marker.removeMarker(PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.UNRELENTING_ONSLAUGHT_MARKER);
        this.marker.removeMarker(PokemonCardList.UNRELENTING_ONSLAUGHT_2_MARKER);
        this.marker.markers = [];
        this.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        this.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
        this.poisonDamage = 10;
        this.burnDamage = 20;
        if (this.cards.length === 0) {
            this.damage = 0;
        }
        if (this.tool && !this.cards.includes(this.tool)) {
            this.tool = undefined;
        }
    }
    clearAllSpecialConditions() {
        this.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        this.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
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
            card_types_1.SpecialCondition.ABILITY_USED,
        ].includes(s) === false);
        this.specialConditions.push(sp);
    }
    removeBoardEffect(sp) {
        if (!this.boardEffect.includes(sp)) {
            return;
        }
        this.boardEffect = this.boardEffect
            .filter(s => s !== sp);
    }
    addBoardEffect(sp) {
        if (this.boardEffect.includes(sp)) {
            return;
        }
        this.boardEffect = this.boardEffect.filter(s => [
            card_types_1.BoardEffect.ABILITY_USED,
            card_types_1.BoardEffect.POWER_GLOW,
            card_types_1.BoardEffect.POWER_NEGATED_GLOW,
            card_types_1.BoardEffect.POWER_RETURN,
        ].includes(s) === false);
        this.boardEffect.push(sp);
    }
    hasRuleBox() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_ex) || c.tags.includes(card_types_1.CardTag.RADIANT) || c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || c.tags.includes(card_types_1.CardTag.POKEMON_GX) || c.tags.includes(card_types_1.CardTag.PRISM_STAR) || c.tags.includes(card_types_1.CardTag.BREAK));
    }
    vPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR));
    }
    exPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_ex));
    }
    futurePokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.FUTURE));
    }
    ancientPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.ANCIENT));
    }
    isTera() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_TERA));
    }
    isLillies() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.LILLIES));
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
PokemonCardList.CLEAR_KNOCKOUT_MARKER_2 = 'CLEAR_KNOCKOUT_MARKER_2';
PokemonCardList.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN';
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
PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';
PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
PokemonCardList.UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
PokemonCardList.UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';
