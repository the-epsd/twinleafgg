"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PokemonCardList = void 0;
var card_types_1 = require("../card/card-types");
var pokemon_card_1 = require("../card/pokemon-card");
var card_list_1 = require("./card-list");
var card_marker_1 = require("./card-marker");
var PokemonCardList = /** @class */ (function (_super) {
    __extends(PokemonCardList, _super);
    function PokemonCardList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.damage = 0;
        _this.hp = 0;
        _this.specialConditions = [];
        _this.poisonDamage = 10;
        _this.burnDamage = 20;
        _this.marker = new card_marker_1.Marker();
        _this.pokemonPlayedTurn = 0;
        _this.sleepFlips = 1;
        _this.boardEffect = [];
        _this.hpBonus = 0;
        _this.isActivatingCard = false;
        _this.showAllStageAbilities = false;
        return _this;
    }
    PokemonCardList.prototype.getPokemons = function () {
        var result = [];
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
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
    };
    PokemonCardList.prototype.getPokemonCard = function () {
        var pokemons = this.getPokemons();
        if (pokemons.length > 0) {
            return pokemons[pokemons.length - 1];
        }
    };
    PokemonCardList.prototype.isStage = function (stage) {
        var pokemonCard = this.getPokemonCard();
        if (pokemonCard === undefined) {
            return false;
        }
        return pokemonCard.stage === stage;
    };
    PokemonCardList.prototype.clearAttackEffects = function () {
        this.marker.markers = [];
    };
    PokemonCardList.prototype.clearEffects = function () {
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
        this.marker.markers = [];
        this.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        this.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
        this.poisonDamage = 10;
        this.burnDamage = 20;
        // if (this.cards.length === 0) {
        //   this.damage = 0;
        // }
        // if (this.tool && !this.cards.includes(this.tool)) {
        //   this.tool = undefined;
        // }
    };
    PokemonCardList.prototype.clearAllSpecialConditions = function () {
        this.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        this.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
    };
    PokemonCardList.prototype.removeSpecialCondition = function (sp) {
        if (!this.specialConditions.includes(sp)) {
            return;
        }
        this.specialConditions = this.specialConditions
            .filter(function (s) { return s !== sp; });
    };
    PokemonCardList.prototype.addSpecialCondition = function (sp) {
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
        this.specialConditions = this.specialConditions.filter(function (s) { return [
            card_types_1.SpecialCondition.PARALYZED,
            card_types_1.SpecialCondition.CONFUSED,
            card_types_1.SpecialCondition.ASLEEP,
            card_types_1.SpecialCondition.ABILITY_USED,
        ].includes(s) === false; });
        this.specialConditions.push(sp);
    };
    PokemonCardList.prototype.removeBoardEffect = function (sp) {
        if (!this.boardEffect.includes(sp)) {
            return;
        }
        this.boardEffect = this.boardEffect
            .filter(function (s) { return s !== sp; });
    };
    PokemonCardList.prototype.addBoardEffect = function (sp) {
        if (this.boardEffect.includes(sp)) {
            return;
        }
        this.boardEffect = this.boardEffect.filter(function (s) { return [
            card_types_1.BoardEffect.ABILITY_USED,
            card_types_1.BoardEffect.POWER_GLOW,
            card_types_1.BoardEffect.POWER_NEGATED_GLOW,
            card_types_1.BoardEffect.POWER_RETURN,
        ].includes(s) === false; });
        this.boardEffect.push(sp);
    };
    //Rule-Box Pokemon
    PokemonCardList.prototype.hasRuleBox = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.POKEMON_ex) || c.tags.includes(card_types_1.CardTag.RADIANT) || c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || c.tags.includes(card_types_1.CardTag.POKEMON_GX) || c.tags.includes(card_types_1.CardTag.PRISM_STAR) || c.tags.includes(card_types_1.CardTag.BREAK) || c.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA); });
    };
    PokemonCardList.prototype.vPokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR); });
    };
    PokemonCardList.prototype.exPokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.POKEMON_ex); });
    };
    PokemonCardList.prototype.isTera = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.POKEMON_TERA); });
    };
    //Single/Rapid/Fusion Strike
    PokemonCardList.prototype.singleStrikePokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.SINGLE_STRIKE); });
    };
    PokemonCardList.prototype.rapidStrikePokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.RAPID_STRIKE); });
    };
    PokemonCardList.prototype.fusionStrikePokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.FUSION_STRIKE); });
    };
    //Future/Ancient
    PokemonCardList.prototype.futurePokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.FUTURE); });
    };
    PokemonCardList.prototype.ancientPokemon = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.ANCIENT); });
    };
    //Trainer Pokemon
    PokemonCardList.prototype.isLillies = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.LILLIES); });
    };
    PokemonCardList.prototype.isNs = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.NS); });
    };
    PokemonCardList.prototype.isIonos = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.IONOS); });
    };
    PokemonCardList.prototype.isHops = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.HOPS); });
    };
    PokemonCardList.prototype.isEthans = function () {
        return this.cards.some(function (c) { return c.tags.includes(card_types_1.CardTag.ETHANS); });
    };
    PokemonCardList.prototype.getToolEffect = function () {
        if (!this.tool) {
            return;
        }
        var toolCard = this.tool.cards;
        if (toolCard instanceof pokemon_card_1.PokemonCard) {
            return toolCard.powers[0] || toolCard.attacks[0];
        }
        // removeTool(tool: Card): void {
        //   const index = this.tools.indexOf(tool);
        //   if (index >= 0) {
        //     delete this.tools[index];
        //   }
        //   this.tools = this.tools.filter(c => c instanceof Card);
        // }
    };
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
    return PokemonCardList;
}(card_list_1.CardList));
exports.PokemonCardList = PokemonCardList;
