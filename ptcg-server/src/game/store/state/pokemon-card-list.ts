import { Card } from '../card/card';
import { BoardEffect, CardTag, SpecialCondition, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Attack, Power } from '../card/pokemon-types';
import { CardList } from './card-list';
import { Marker } from './card-marker';

export class PokemonCardList extends CardList {

  public damage: number = 0;

  public hp: number = 0;

  public specialConditions: SpecialCondition[] = [];

  public poisonDamage: number = 10;

  public burnDamage: number = 20;

  public marker = new Marker();

  public attackMarker = new Marker();

  public abilityMarker = new Marker();

  public pokemonPlayedTurn: number = 0;

  public sleepFlips = 1;

  public boardEffect: BoardEffect[] = [];

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

  // Some pokemon cards can be attached as a tool and stadium,
  // we must remember, which card acts as a pokemon tool.
  public tool: Card | undefined;
  public stadium: Card | undefined;
  public stage: Stage = Stage.BASIC;
  public attacksThisTurn?: number;
  isActivatingCard: boolean = false;

  public getPokemons(): PokemonCard[] {
    const result: PokemonCard[] = [];
    for (const card of this.cards) {
      if (card.superType === SuperType.POKEMON && card !== this.tool) {
        result.push(card as PokemonCard);
      } else if (card.name === 'Lillie\'s Poké Doll') {
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

  public isBasic(): boolean {
    const pokemons = this.getPokemons();
    if (pokemons.length !== 1) {
      return false;
    }
    return pokemons[0].stage === Stage.BASIC;
  }

  clearAttackEffects(): void {
    this.marker.markers = [];
  }

  clearEffects(): void {

    this.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_MARKER);
    this.attackMarker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER);
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
    this.attackMarker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER);
    this.attackMarker.removeMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
    this.attackMarker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
    this.attackMarker.removeMarker(PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER);
    this.attackMarker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.attackMarker.removeMarker(PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);

    this.marker.markers = [];
    // if (this.specialConditions.includes(SpecialCondition.ABILITY_USED)) {
    //   return;
    // }
    this.removeBoardEffect(BoardEffect.ABILITY_USED);
    this.removeSpecialCondition(SpecialCondition.POISONED);
    this.removeSpecialCondition(SpecialCondition.ASLEEP);
    this.removeSpecialCondition(SpecialCondition.BURNED);
    this.removeSpecialCondition(SpecialCondition.CONFUSED);
    this.removeSpecialCondition(SpecialCondition.PARALYZED);
    this.poisonDamage = 10;
    this.burnDamage = 20;
    if (this.cards.length === 0) {
      this.damage = 0;
    }
    if (this.tool && !this.cards.includes(this.tool)) {
      this.tool = undefined;
    }
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

  hasRuleBox(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex) || c.tags.includes(CardTag.RADIANT) || c.tags.includes(CardTag.ACE_SPEC) || c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR));
  }

  vPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR));
  }

  exPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_V));
  }

  futurePokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.FUTURE));
  }

  ancientPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.ANCIENT));
  }

  isTera(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_TERA));
  }

  isLillies(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.LILLIES));
  }

  getToolEffect(): Power | Attack | undefined {
    if (!this.tool) {
      return;
    }

    const toolCard = this.tool.cards;

    if (toolCard instanceof PokemonCard) {
      return toolCard.powers[0] || toolCard.attacks[0];
    }

    return;
  }

}
