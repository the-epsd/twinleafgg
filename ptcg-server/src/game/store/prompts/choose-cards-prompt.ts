import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { CardType, EnergyType, SuperType, TrainerType, Stage } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard, getPrimaryCardType } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import type { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { matchesPromptFilter } from './prompt-card-filter';
import { Prompt } from './prompt';

export { matchesPromptFilter } from './prompt-card-filter';

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
  maxBasics: number | undefined;
  maxEvolutions: number | undefined;
  maxStage1: number | undefined;
  maxStage2: number | undefined;
}

export type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>;

/**
 * Same checks as ChooseCardsPrompt.validate, without depending on the class
 * method. The React app deep-imports this so a stale Vite prebundle of the
 * prompt class cannot keep OK disabled after cardType became an array.
 */
export function chooseCardsSelectionValid(
  cards: Card[],
  result: Card[] | null,
  filter: FilterType,
  options: ChooseCardsOptions,
): boolean {
  if (result === null) {
    return options.allowCancel;
  }
  if (result.length < options.min || result.length > options.max) {
    return false;
  }

  if (!options.allowDifferentSuperTypes) {
    const set = new Set(result.map(r => r.superType));
    if (set.size > 1) {
      return false;
    }
  }

  if (options.differentTypes) {
    const typeMap: { [key: number]: boolean } = {};
    for (const card of result) {
      const cardType = ChooseCardsPrompt.getCardType(card);
      if (typeMap[cardType] === true) {
        return false;
      }
      typeMap[cardType] = true;
    }
  }

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

    if (card.superType === SuperType.POKEMON) {
      const pokemonCard = card as PokemonCard;
      const stageCount = countMap[`${card.superType}-${pokemonCard.stage}`] || 0;
      countMap[`${card.superType}-${pokemonCard.stage}`] = stageCount + 1;
    }
  }

  const { maxPokemons, maxBasicEnergies, maxTrainers, maxItems, maxTools, maxStadiums, maxSupporters, maxSpecialEnergies, maxEnergies, maxBasics, maxEvolutions, maxStage1, maxStage2 } = options;

  if ((maxBasics !== undefined || maxEvolutions !== undefined) && maxStage1 === undefined && maxStage2 === undefined) {
    const hasBasics = countMap[`${SuperType.POKEMON}-${Stage.BASIC}`] > 0;
    const hasEvolutions = countMap[`${SuperType.POKEMON}`] - (countMap[`${SuperType.POKEMON}-${Stage.BASIC}`] || 0) > 0;
    if (hasBasics && hasEvolutions) {
      return false;
    }
  }

  if ((maxPokemons !== undefined && maxPokemons < countMap[`${SuperType.POKEMON}`])
    || (maxBasicEnergies !== undefined && maxBasicEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.BASIC}`])
    || (maxEnergies !== undefined && maxEnergies < countMap[`${SuperType.ENERGY}`])
    || (maxTrainers !== undefined && maxTrainers < countMap[`${SuperType.TRAINER}`])
    || (maxItems !== undefined && maxItems < countMap[`${SuperType.TRAINER}-${TrainerType.ITEM}`])
    || (maxStadiums !== undefined && maxStadiums < countMap[`${SuperType.TRAINER}-${TrainerType.STADIUM}`])
    || (maxSupporters !== undefined && maxSupporters < countMap[`${SuperType.TRAINER}-${TrainerType.SUPPORTER}`])
    || (maxSpecialEnergies !== undefined && maxSpecialEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.SPECIAL}`])
    || (maxTools !== undefined && maxTools < countMap[`${SuperType.TRAINER}-${TrainerType.TOOL}`])
    || (maxBasics !== undefined && maxBasics < countMap[`${SuperType.POKEMON}-${Stage.BASIC}`])
    || (maxEvolutions !== undefined && maxEvolutions < (countMap[`${SuperType.POKEMON}`] - (countMap[`${SuperType.POKEMON}-${Stage.BASIC}`] || 0)))
    || (maxStage1 !== undefined && maxStage1 < (countMap[`${SuperType.POKEMON}-${Stage.STAGE_1}`] || 0))
    || (maxStage2 !== undefined && maxStage2 < (countMap[`${SuperType.POKEMON}-${Stage.STAGE_2}`] || 0))) {
    return false;
  }

  const blocked = options.blocked ?? [];
  return result.every(r => {
    const index = cards.indexOf(r);
    return index !== -1 && !blocked.includes(index) && matchesPromptFilter(r, filter);
  });
}

export class ChooseCardsPrompt extends Prompt<Card[]> {

  readonly type: string = ChooseCardsPromptType;

  public options: ChooseCardsOptions;
  private blockedCardIds: number[] = [];
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
      maxBasics: undefined,
      maxEvolutions: undefined,
      maxStage1: undefined,
      maxStage2: undefined,
    }, options);

    if (this.options.blocked.length > 0) {
      for (let i = 0; i < this.cards.cards.length; i++) {
        if (this.options.blocked.indexOf(i) !== -1) {
          if (this.blockedCardIds.indexOf(this.cards.cards[i].id) === -1) {
            this.blockedCardIds.push(this.cards.cards[i].id);
          }
        }
      }
    }

    if (!this.options.isSecret) {
      if (this.cards === this.player.deck || this.cards === this.player.discard) {
        this.cards.sort();
      }
    }

    if (this.options.blocked.length > 0) {
      this.options.blocked = [];
      this.cards.cards.forEach((card, index) => {
        if (this.blockedCardIds.indexOf(card.id) !== -1) {
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
    return chooseCardsSelectionValid(this.cards.cards, result, this.filter, this.options);
  }

  public static getCardType(card: Card): CardType {
    if (card.superType === SuperType.ENERGY) {
      const energyCard = card as EnergyCard;
      return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
    }
    if (card.superType === SuperType.POKEMON) {
      const pokemonCard = card as PokemonCard;
      return getPrimaryCardType(pokemonCard);
    }
    return CardType.NONE;
  }

}