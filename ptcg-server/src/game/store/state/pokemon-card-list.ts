import { Card } from '../card/card';
import { BoardEffect, CardTag, SpecialCondition, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Power, Attack } from '../card/pokemon-types';
import { CardList } from './card-list';
import { Marker } from './card-marker';
import { State } from './state';
import { StateUtils } from '../state-utils';

export class PokemonCardList extends CardList {

  public damage: number = 0;
  public hp: number = 0;
  public specialConditions: SpecialCondition[] = [];
  public poisonDamage: number = 10;
  public burnDamage: number = 20;
  public confusionDamage: number = 30;
  public marker = new Marker();
  public pokemonPlayedTurn: number = 0;
  public sleepFlips = 1;
  public boardEffect: BoardEffect[] = [];
  public hpBonus: number = 0;
  public tools: Card[] = [];
  public energies: CardList = new CardList();
  public stadium: Card | undefined;
  public isActivatingCard: boolean = false;
  public attacksThisTurn?: number;
  public showAllStageAbilities: boolean = false;
  public triggerEvolutionAnimation: boolean = false;
  public showBasicAnimation: boolean = false;
  public triggerAttackAnimation: boolean = false;
  public damageReductionNextTurn: number = 0;
  public cannotAttackNextTurn: boolean = false;
  public cannotAttackNextTurnPending: boolean = false;
  public cannotUseAttacksNextTurn: string[] = [];
  public cannotUseAttacksNextTurnPending: string[] = [];
  public _preservedConditionsDuringEvolution?: SpecialCondition[];


  public static readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public static readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
  public static readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
  public static readonly CLEAR_KNOCKOUT_MARKER_2 = 'CLEAR_KNOCKOUT_MARKER_2';
  public static readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public static readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public static readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
  public static readonly PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
  public static readonly CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
  public static readonly PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN';
  public static readonly CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN';
  public static readonly OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
  public static readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
  public static readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public static readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public static readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public static readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public static readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
  public static readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
  public static readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
  public static readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public static readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public static readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';
  public static readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
  public static readonly PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
  public static readonly CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';

  public static readonly UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
  public static readonly UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';

  public getPokemons(): PokemonCard[] {
    const result: PokemonCard[] = [];
    for (const card of this.cards) {
      if (card.superType === SuperType.POKEMON && !this.tools.includes(card) && !this.energies.cards.includes(card)) {
        result.push(card as PokemonCard);
      } else if (card.name === 'Lillie\'s Poké Doll') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Clefairy Doll') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Rare Fossil') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Robo Substitute') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Mysterious Fossil') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Unidentified Fossil') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Antique Plume Fossil') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Antique Cover Fossil') {
        result.push(card as PokemonCard);
      } else if (card.name === 'Claw Fossil') {
        result.push(card as PokemonCard);
      }
    }
    return result;
  }

  public getPokemonCard(): PokemonCard | undefined {
    const pokemons = this.getPokemons();
    if (pokemons.length > 0) {
      return pokemons[pokemons.length - 1];
    }
  }

  public isStage(stage: Stage): boolean {
    const pokemonCard = this.getPokemonCard();
    if (pokemonCard === undefined) {
      return false;
    }
    return pokemonCard.stage === stage;
  }

  public isEvolved(): boolean {
    const pokemons = this.getPokemons();
    const pokemonCard = this.getPokemonCard();

    // Single Pokémon (not evolved)
    if (pokemons.length === 1) {
      return false;
    }

    // LEGEND cards are not considered evolved
    if (pokemonCard?.stage === Stage.LEGEND) {
      return false;
    }

    // VUNION cards are not considered evolved
    if (pokemonCard?.stage === Stage.VUNION) {
      return false;
    }

    // LV_X placed on a Pokémon is not considered evolved
    if (pokemonCard?.stage === Stage.LV_X && pokemons.length === 2) {
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
  removeAttackEffects(): void {
    this.marker.removeAttackEffects();
    this.cannotAttackNextTurn = false;
    this.cannotAttackNextTurnPending = false;
    this.cannotUseAttacksNextTurn = [];
    this.cannotUseAttacksNextTurnPending = [];
    this.damageReductionNextTurn = 0;
  }

  clearEffects(): void {
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

  clearAllSpecialConditions(): void {
    this.removeSpecialCondition(SpecialCondition.POISONED);
    this.removeSpecialCondition(SpecialCondition.ASLEEP);
    this.removeSpecialCondition(SpecialCondition.BURNED);
    this.removeSpecialCondition(SpecialCondition.CONFUSED);
    this.removeSpecialCondition(SpecialCondition.PARALYZED);
  }

  removeSpecialCondition(sp: SpecialCondition): void {
    if (!this.specialConditions.includes(sp)) {
      return;
    }
    this.specialConditions = this.specialConditions
      .filter(s => s !== sp);
  }

  addSpecialCondition(sp: SpecialCondition): void {
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
      SpecialCondition.ABILITY_USED,
    ].includes(s) === false);
    this.specialConditions.push(sp);
  }

  removeBoardEffect(sp: BoardEffect): void {
    if (!this.boardEffect.includes(sp)) {
      return;
    }
    this.boardEffect = this.boardEffect
      .filter(s => s !== sp);
  }

  addBoardEffect(sp: BoardEffect): void {
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

  hasRuleBox(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex) || c.tags.includes(CardTag.RADIANT) || c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_GX) || c.tags.includes(CardTag.PRISM_STAR) || c.tags.includes(CardTag.BREAK) || c.tags.includes(CardTag.POKEMON_SV_MEGA) || c.tags.includes(CardTag.LEGEND) || c.tags.includes(CardTag.POKEMON_LV_X) || c.tags.includes(CardTag.POKEMON_VUNION) || c.tags.includes(CardTag.TAG_TEAM) || c.tags.includes(CardTag.MEGA));
  }

  vPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_VUNION));
  }

  exPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex));
  }

  isTera(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_TERA));
  }

  //Single/Rapid/Fusion Strike

  singleStrikePokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.SINGLE_STRIKE));
  }

  rapidStrikePokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.RAPID_STRIKE));
  }

  fusionStrikePokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.FUSION_STRIKE));
  }

  //Future/Ancient

  futurePokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.FUTURE));
  }

  ancientPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.ANCIENT));
  }

  //Trainer Pokemon

  isLillies(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.LILLIES));
  }

  isNs(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.NS));
  }

  isIonos(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.IONOS));
  }

  isHops(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.HOPS));
  }

  isEthans(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.ETHANS));
  }

  getToolEffect(): Power | Attack | undefined {
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

  isPlayerActive(state: State): boolean {
    const player = state.players[state.activePlayer];
    return player.active === this;
  }

  isOpponentActive(state: State): boolean {
    const opponent = StateUtils.getOpponent(state, state.players[state.activePlayer]);
    return opponent.active === this;
  }

  isPlayerBench(state: State): boolean {
    const player = state.players[state.activePlayer];
    return player.bench.includes(this);
  }

  isOpponentBench(state: State): boolean {
    const opponent = StateUtils.getOpponent(state, state.players[state.activePlayer]);
    return opponent.bench.includes(this);
  }

  // Override the parent CardList's moveTo method to properly handle Pokemon acting as energy
  public moveTo(destination: CardList, count?: number): void {
    // Move energies CardList to destination before moving cards
    if (this.energies.cards.length > 0) {
      this.energies.moveTo(destination);
    }

    super.moveTo(destination, count);
  }

  public moveCardsTo(cards: Card[], destination: CardList): void {
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
      } else {
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
        } else {
          // If not found in cards or energies, check tools
          index = this.tools.indexOf(cards[i]);
          if (index !== -1) {
            const card = this.tools.splice(index, 1);
            destination.cards.push(card[0]);
            // If destination is a PokemonCardList and card is an energy card, add to energies.cards
            if (destination instanceof PokemonCardList) {
              const isEnergyCard = card[0].superType === SuperType.ENERGY || (card[0] as any).energyType !== undefined;
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