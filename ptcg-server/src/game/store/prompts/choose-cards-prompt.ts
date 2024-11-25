import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { CardType, EnergyType, SuperType, TrainerType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { Prompt } from './prompt';

export const ChooseCardsPromptType = 'Choose cards';

export interface ChooseCardsOptions {
  min: number;
  max: number;
  allowCancel: boolean;
  blocked: number[];
  isSecret: boolean;
  differentTypes: boolean;
  maxPokemons: number | undefined;
  maxBasicEnergies: number | undefined;
  maxEnergies: number | undefined;
  maxTrainers: number | undefined;
  maxTools: number | undefined;
  maxStadiums: number | undefined;
  maxSupporters: number | undefined;
  maxSpecialEnergies: number | undefined;
  maxItems: number | undefined;
  allowDifferentSuperTypes: boolean;
}

export type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>;

export class ChooseCardsPrompt extends Prompt<Card[]> {

  readonly type: string = ChooseCardsPromptType;

  public options: ChooseCardsOptions;
  private blockedCardNames: string[] = [];
  public player: Player;

  constructor(
    player: Player,
    public message: GameMessage,
    public cards: CardList,
    public filter: FilterType,
    options?: Partial<ChooseCardsOptions>
  ) {
    super(player.id);
    this.player = player;
    // Default options
    this.options = Object.assign({}, {
      min: 0,
      max: cards.cards.length,
      allowCancel: true,
      blocked: [],
      isSecret: false,
      differentTypes: false,
      allowDifferentSuperTypes: true,
      maxPokemons: undefined,
      maxBasicEnergies: undefined,
      maxEnergies: undefined,
      maxTrainers: undefined,
      maxTools: undefined,
      maxStadiums: undefined,
      maxSupporters: undefined,
      maxSpecialEnergies: undefined,
      maxItems: undefined,
    }, options);

    if (this.options.blocked.length > 0) {
      for (let i = 0; i < this.cards.cards.length; i++) {
        if (this.options.blocked.indexOf(i) !== -1) {
          if (this.blockedCardNames.indexOf(this.cards.cards[i].name) === -1) {
            this.blockedCardNames.push(this.cards.cards[i].name);
          }
        }
      }
    }

    if (this.cards === this.player.deck || this.cards === this.player.discard) {
      this.cards.sort();
    }

    if (this.options.blocked.length > 0) {
      this.options.blocked = [];
      this.cards.cards.forEach((card, index) => {
        if (this.blockedCardNames.indexOf(card.name) !== -1) {
          this.options.blocked.push(index);
        }
      });
    }
  }

  public decode(result: number[] | null): Card[] | null {
    if (result === null) {
      return null;
    }
    const cards: Card[] = this.cards.cards;
    return result.map(index => cards[index]);
  }

  public validate(result: Card[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }

    if (!this.options.allowDifferentSuperTypes) {
      const set = new Set(result.map(r => r.superType));
      if (set.size > 1) {
        return false;
      }
    }

    // Check if 'different types' restriction is valid
    if (this.options.differentTypes) {
      const typeMap: { [key: number]: boolean } = {};
      for (const card of result) {
        const cardType = ChooseCardsPrompt.getCardType(card);
        if (typeMap[cardType] === true) {
          return false;
        } else {
          typeMap[cardType] = true;
        }
      }
    }

    // Check if 'max' restrictions are valid
    const countMap: { [key: string]: number } = {};
    for (const card of result) {
      const count = countMap[card.superType.toString()] || 0;
      countMap[card.superType.toString()] = count + 1;

      if (card.superType === SuperType.TRAINER) {
        const trainerTypeCount = countMap[`${card.superType}-${(card as TrainerCard).trainerType}`] || 0;
        countMap[`${card.superType}-${(card as TrainerCard).trainerType}`] = trainerTypeCount + 1;
      }

      if (card.superType === SuperType.ENERGY) {
        const energyTypeCount = countMap[`${card.superType}-${(card as EnergyCard).energyType}`] || 0;
        countMap[`${card.superType}-${(card as EnergyCard).energyType}`] = energyTypeCount + 1;
      }
    }

    const { maxPokemons, maxBasicEnergies, maxTrainers, maxItems, maxTools, maxStadiums, maxSupporters, maxSpecialEnergies, maxEnergies } = this.options;
    if ((maxPokemons !== undefined && maxPokemons < countMap[`${SuperType.POKEMON}`])
      || (maxBasicEnergies !== undefined && maxBasicEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.BASIC}`])
      || (maxEnergies !== undefined && maxEnergies < countMap[`${SuperType.ENERGY}`])
      || (maxTrainers !== undefined && maxTrainers < countMap[`${SuperType.TRAINER}-${SuperType.TRAINER}`])
      || (maxItems !== undefined && maxItems < countMap[`${SuperType.TRAINER}-${TrainerType.ITEM}`])
      || (maxStadiums !== undefined && maxStadiums < countMap[`${SuperType.TRAINER}-${TrainerType.STADIUM}`])
      || (maxSupporters !== undefined && maxSupporters < countMap[`${SuperType.TRAINER}-${TrainerType.SUPPORTER}`])
      || (maxSpecialEnergies !== undefined && maxSpecialEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.SPECIAL}`])
      || (maxTools !== undefined && maxTools < countMap[`${SuperType.TRAINER}-${TrainerType.TOOL}`])) {
      return false;
    }

    const blocked = this.options.blocked;
    return result.every(r => {
      const index = this.cards.cards.indexOf(r);
      return index !== -1 && !blocked.includes(index) && this.matchesFilter(r);
    });
  }

  public static getCardType(card: Card): CardType {
    if (card.superType === SuperType.ENERGY) {
      const energyCard = card as EnergyCard;
      return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
    }
    if (card.superType === SuperType.POKEMON) {
      const pokemonCard = card as PokemonCard;
      return pokemonCard.cardType;
    }
    return CardType.NONE;
  }

  private matchesFilter(card: Card): boolean {
    for (const key in this.filter) {
      if (Object.prototype.hasOwnProperty.call(this.filter, key)) {
        if ((this.filter as any)[key] !== (card as any)[key]) {
          return false;
        }
      }
    }
    return true;
  }

}
