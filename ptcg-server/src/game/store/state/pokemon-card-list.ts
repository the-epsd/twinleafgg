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
  public marker = new Marker();
  public pokemonPlayedTurn: number = 0;
  public sleepFlips = 1;
  public boardEffect: BoardEffect[] = [];
  public hpBonus: number = 0;
  public tool: Card | undefined;
  public energyCards: Card[] = [];
  public stadium: Card | undefined;
  public isActivatingCard: boolean = false;
  public attacksThisTurn?: number;
  public showAllStageAbilities: boolean = false;
  public triggerAnimation: boolean = false;
  public showBasicAnimation: boolean = false;
  public triggerAttackAnimation: boolean = false;


  public static readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public static readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
  public static readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
  public static readonly CLEAR_KNOCKOUT_MARKER_2 = 'CLEAR_KNOCKOUT_MARKER_2';
  public static readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
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
      if (card.superType === SuperType.POKEMON && card !== this.tool && !this.energyCards.includes(card)) {
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

  clearAttackEffects(): void {
    this.marker.markers = [];
  }

  clearEffects(): void {

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
    this.removeSpecialCondition(SpecialCondition.POISONED);
    this.removeSpecialCondition(SpecialCondition.ASLEEP);
    this.removeSpecialCondition(SpecialCondition.BURNED);
    this.removeSpecialCondition(SpecialCondition.CONFUSED);
    this.removeSpecialCondition(SpecialCondition.PARALYZED);
    this.poisonDamage = 10;
    this.burnDamage = 20;
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

  // Add a Pokemon card as energy
  addPokemonAsEnergy(card: Card): void {
    if (!this.energyCards.includes(card) && this.cards.includes(card)) {
      this.energyCards.push(card);
    }
  }

  // Remove a Pokemon card from energy list
  removePokemonAsEnergy(card: Card): void {
    const index = this.energyCards.indexOf(card);
    if (index !== -1) {
      this.energyCards.splice(index, 1);
    }
  }

  //Rule-Box Pokemon

  hasRuleBox(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex) || c.tags.includes(CardTag.RADIANT) || c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_GX) || c.tags.includes(CardTag.PRISM_STAR) || c.tags.includes(CardTag.BREAK) || c.tags.includes(CardTag.POKEMON_SV_MEGA));
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
    if (!this.tool) {
      return;
    }

    const toolCard = this.tool.cards;

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
    // Reset Pokemon-as-energy status before moving cards
    if (this.energyCards.length > 0) {
      this.energyCards = [];
    }

    super.moveTo(destination, count);
  }
}