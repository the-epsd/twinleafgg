import { BoardEffect, CardTag, SpecialCondition, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { CardList } from './card-list';
import { Marker } from './card-marker';
import { StateUtils } from '../state-utils';
export class PokemonCardList extends CardList {
    constructor() {
        super(...arguments);
        this.damage = 0;
        this.hp = 0;
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.confusionDamage = 30;
        this.marker = new Marker();
        this.pokemonPlayedTurn = 0;
        this.sleepFlips = 1;
        this.boardEffect = [];
        this.hpBonus = 0;
        this.tools = [];
        this.energies = new CardList();
        this.isActivatingCard = false;
        this.showAllStageAbilities = false;
        this.triggerEvolutionAnimation = false;
        this.showBasicAnimation = false;
        this.triggerAttackAnimation = false;
        this.damageReductionNextTurn = 0;
        this.cannotAttackNextTurn = false;
        this.cannotAttackNextTurnPending = false;
        this.cannotUseAttacksNextTurn = [];
        this.cannotUseAttacksNextTurnPending = [];
    }
    getPokemons() {
        const result = [];
        for (const card of this.cards) {
            if (card.superType === SuperType.POKEMON && !this.tools.includes(card) && !this.energies.cards.includes(card)) {
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
            else if (card.name === 'Antique Plume Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Cover Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Skull Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Shield Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Jaw Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Sail Fossil') {
                result.push(card);
            }
            else if (card.name === 'Claw Fossil') {
                result.push(card);
            }
            else if (card.name === 'Root Fossil') {
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
    isStage(stage) {
        const pokemonCard = this.getPokemonCard();
        if (pokemonCard === undefined) {
            return false;
        }
        return pokemonCard.stage === stage;
    }
    isEvolved() {
        const pokemons = this.getPokemons();
        const pokemonCard = this.getPokemonCard();
        // Single Pokémon (not evolved)
        if (pokemons.length === 1) {
            return false;
        }
        // LEGEND cards are not considered evolved
        if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === Stage.LEGEND) {
            return false;
        }
        // VUNION cards are not considered evolved
        if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === Stage.VUNION) {
            return false;
        }
        // LV_X placed on a Pokémon is not considered evolved
        if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === Stage.LV_X && pokemons.length === 2) {
            return false;
        }
        // Otherwise, it's evolved
        return true;
    }
    /**
     * Surgically remove only attack-sourced effects from this Pokemon.
     * Unlike `clearEffects()`, this preserves special conditions, ability markers,
     * and other non-attack state.
     */
    removeAttackEffects() {
        this.marker.removeAttackEffects();
        this.cannotAttackNextTurn = false;
        this.cannotAttackNextTurnPending = false;
        this.cannotUseAttacksNextTurn = [];
        this.cannotUseAttacksNextTurnPending = [];
        this.damageReductionNextTurn = 0;
    }
    clearEffects() {
        // Nuclear option: wipe all markers (used by evolution/KO)
        this.marker.markers = [];
        this.triggerEvolutionAnimation = false;
        this.showBasicAnimation = false;
        this.triggerAttackAnimation = false;
        // Check if we're in an evolution context (preserved conditions are set)
        const preservedConditions = this._preservedConditionsDuringEvolution || [];
        // Only remove special conditions that are not preserved
        const conditionsToRemove = [
            SpecialCondition.POISONED,
            SpecialCondition.ASLEEP,
            SpecialCondition.BURNED,
            SpecialCondition.CONFUSED,
            SpecialCondition.PARALYZED
        ].filter(condition => !preservedConditions.includes(condition));
        conditionsToRemove.forEach(condition => {
            this.removeSpecialCondition(condition);
        });
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.confusionDamage = 30;
        this.damageReductionNextTurn = 0;
        this.cannotAttackNextTurn = false;
        this.cannotAttackNextTurnPending = false;
        this.cannotUseAttacksNextTurn = [];
        this.cannotUseAttacksNextTurnPending = [];
        // if (this.cards.length === 0) {
        //   this.damage = 0;
        // }
        // if (this.tool && !this.cards.includes(this.tool)) {
        //   this.tool = undefined;
        // }
    }
    clearAllSpecialConditions() {
        this.removeSpecialCondition(SpecialCondition.POISONED);
        this.removeSpecialCondition(SpecialCondition.ASLEEP);
        this.removeSpecialCondition(SpecialCondition.BURNED);
        this.removeSpecialCondition(SpecialCondition.CONFUSED);
        this.removeSpecialCondition(SpecialCondition.PARALYZED);
    }
    removeSpecialCondition(sp) {
        if (!this.specialConditions.includes(sp)) {
            return;
        }
        this.specialConditions = this.specialConditions
            .filter(s => s !== sp);
    }
    addSpecialCondition(sp) {
        if (sp === SpecialCondition.POISONED) {
            this.poisonDamage = 10;
        }
        if (sp === SpecialCondition.BURNED) {
            this.burnDamage = 20;
        }
        if (sp === SpecialCondition.CONFUSED) {
            this.confusionDamage = 30;
        }
        if (this.specialConditions.includes(sp)) {
            return;
        }
        if (sp === SpecialCondition.POISONED || sp === SpecialCondition.BURNED) {
            this.specialConditions.push(sp);
            return;
        }
        this.specialConditions = this.specialConditions.filter(s => [
            SpecialCondition.PARALYZED,
            SpecialCondition.CONFUSED,
            SpecialCondition.ASLEEP,
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
            BoardEffect.ABILITY_USED,
            BoardEffect.POWER_GLOW,
            BoardEffect.POWER_NEGATED_GLOW,
            BoardEffect.POWER_RETURN,
        ].includes(s) === false);
        this.boardEffect.push(sp);
    }
    //Rule-Box Pokemon
    hasRuleBox() {
        return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex) || c.tags.includes(CardTag.RADIANT) || c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_GX) || c.tags.includes(CardTag.PRISM_STAR) || c.tags.includes(CardTag.BREAK) || c.tags.includes(CardTag.POKEMON_SV_MEGA) || c.tags.includes(CardTag.LEGEND) || c.tags.includes(CardTag.POKEMON_LV_X) || c.tags.includes(CardTag.POKEMON_VUNION) || c.tags.includes(CardTag.TAG_TEAM) || c.tags.includes(CardTag.MEGA));
    }
    vPokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_VUNION));
    }
    exPokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex));
    }
    isTera() {
        return this.cards.some(c => c.tags.includes(CardTag.POKEMON_TERA));
    }
    //Single/Rapid/Fusion Strike
    singleStrikePokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.SINGLE_STRIKE));
    }
    rapidStrikePokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.RAPID_STRIKE));
    }
    fusionStrikePokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.FUSION_STRIKE));
    }
    //Future/Ancient
    futurePokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.FUTURE));
    }
    ancientPokemon() {
        return this.cards.some(c => c.tags.includes(CardTag.ANCIENT));
    }
    //Trainer Pokemon
    isLillies() {
        return this.cards.some(c => c.tags.includes(CardTag.LILLIES));
    }
    isNs() {
        return this.cards.some(c => c.tags.includes(CardTag.NS));
    }
    isIonos() {
        return this.cards.some(c => c.tags.includes(CardTag.IONOS));
    }
    isHops() {
        return this.cards.some(c => c.tags.includes(CardTag.HOPS));
    }
    isEthans() {
        return this.cards.some(c => c.tags.includes(CardTag.ETHANS));
    }
    getToolEffect() {
        if (this.tools.length === 0) {
            return;
        }
        const toolCard = this.tools[0];
        if (toolCard instanceof PokemonCard) {
            return toolCard.powers[0] || toolCard.attacks[0];
        }
        // removeTool(tool: Card): void {
        //   const index = this.tools.indexOf(tool);
        //   if (index >= 0) {
        //     delete this.tools[index];
        //   }
        //   this.tools = this.tools.filter(c => c instanceof Card);
        // }
    }
    isPlayerActive(state) {
        const player = state.players[state.activePlayer];
        return player.active === this;
    }
    isOpponentActive(state) {
        const opponent = StateUtils.getOpponent(state, state.players[state.activePlayer]);
        return opponent.active === this;
    }
    isPlayerBench(state) {
        const player = state.players[state.activePlayer];
        return player.bench.includes(this);
    }
    isOpponentBench(state) {
        const opponent = StateUtils.getOpponent(state, state.players[state.activePlayer]);
        return opponent.bench.includes(this);
    }
    // Override the parent CardList's moveTo method to properly handle Pokemon acting as energy
    moveTo(destination, count) {
        // Move energies CardList to destination before moving cards
        if (this.energies.cards.length > 0) {
            this.energies.moveTo(destination);
        }
        super.moveTo(destination, count);
    }
    moveCardsTo(cards, destination) {
        for (let i = 0; i < cards.length; i++) {
            let index = this.cards.indexOf(cards[i]);
            if (index !== -1) {
                const card = this.cards.splice(index, 1);
                // Remove the card from energies if it's there
                const energyIndex = this.energies.cards.indexOf(card[0]);
                if (energyIndex !== -1) {
                    this.energies.cards.splice(energyIndex, 1);
                }
                destination.cards.push(card[0]);
                // If destination is a PokemonCardList and card is an energy card (not a Pokemon), add to energies.cards
                if (destination instanceof PokemonCardList) {
                    // Only add actual energy cards (superType === ENERGY), not Pokemon cards that can act as energy
                    const isEnergyCard = card[0].superType === SuperType.ENERGY;
                    if (isEnergyCard && !destination.energies.cards.includes(card[0])) {
                        destination.energies.cards.push(card[0]);
                    }
                }
            }
            else {
                // If not found in cards, check energies
                index = this.energies.cards.indexOf(cards[i]);
                if (index !== -1) {
                    const card = this.energies.cards.splice(index, 1);
                    destination.cards.push(card[0]);
                    // If destination is a PokemonCardList and card came from energies, add to destination energies.cards
                    // (This handles both regular energy cards and Pokemon-as-energy cards)
                    if (destination instanceof PokemonCardList) {
                        if (!destination.energies.cards.includes(card[0])) {
                            destination.energies.cards.push(card[0]);
                        }
                    }
                }
                else {
                    // If not found in cards or energies, check tools
                    index = this.tools.indexOf(cards[i]);
                    if (index !== -1) {
                        const card = this.tools.splice(index, 1);
                        destination.cards.push(card[0]);
                        // If destination is a PokemonCardList and card is an energy card, add to energies.cards
                        if (destination instanceof PokemonCardList) {
                            const isEnergyCard = card[0].superType === SuperType.ENERGY || card[0].energyType !== undefined;
                            if (isEnergyCard && !destination.energies.cards.includes(card[0])) {
                                destination.energies.cards.push(card[0]);
                            }
                        }
                    }
                }
            }
        }
    }
}
PokemonCardList.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
PokemonCardList.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
PokemonCardList.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
PokemonCardList.CLEAR_KNOCKOUT_MARKER_2 = 'CLEAR_KNOCKOUT_MARKER_2';
PokemonCardList.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
PokemonCardList.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
PokemonCardList.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
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
