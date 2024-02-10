import { CardList } from './card-list';
import { Marker } from './card-marker';
import { CardTag, SpecialCondition, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Card } from '../card/card';
import { Power, Attack } from '../card/pokemon-types';

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

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';

  // Some pokemon cards can be attached as a tool and stadium,
  // we must remember, which card acts as a pokemon tool.
  public tool: Card | undefined;
  public stadium: Card | undefined;


  public getPokemons(): PokemonCard[] {
    const result: PokemonCard[] = [];
    for (const card of this.cards) {
      if (card.superType === SuperType.POKEMON && card !== this.tool) {
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
      SpecialCondition.ASLEEP
    ].includes(s) === false);
    this.specialConditions.push(sp);
  }

  hasRuleBox(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_ex) || c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR));
  }

  vPokemon(): boolean {
    return this.cards.some(c => c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR));
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
