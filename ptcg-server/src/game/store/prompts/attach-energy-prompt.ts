import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { CardList } from '../state/card-list';
import { FilterType } from './choose-cards-prompt';
import { SuperType, CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';

export const AttachEnergyPromptType = 'Attach energy';

export interface AttachEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number;
  blocked: number[];
  blockedTo: CardTarget[];
  differentTypes: boolean;
  sameTarget: boolean;
  differentTargets: boolean;
  validCardTypes?: CardType[];
  maxPerType?: number  // Add this new option
}

export type AttachEnergyResultType = { to: CardTarget, index: number }[];

export interface CardAssign {
  to: CardTarget;
  card: Card;
}

export class AttachEnergyPrompt extends Prompt<CardAssign[]> {

  readonly type: string = AttachEnergyPromptType;

  public options: AttachEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cardList: CardList,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<AttachEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: cardList.cards.length,
      blocked: [],
      blockedTo: [],
      differentTypes: false,
      sameTarget: false,
      differentTargets: false
    }, options);
  }

  public decode(result: AttachEnergyResultType | null, state: State): CardAssign[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers: CardAssign[] = [];
    result.forEach(t => {
      const cardList = this.cardList;
      const card = cardList.cards[t.index];
      transfers.push({ to: t.to, card });
    });
    return transfers;
  }

  public validate(result: CardAssign[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }

    if (this.options.maxPerType) {
      const typeCounts = new Map<CardType, number>();
      for (const assign of result) {
        const energyCard = assign.card as EnergyCard;
        const type = energyCard.provides[0];
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
        if (typeCounts.get(type)! > this.options.maxPerType) {
          return false;
        }
      }
    }

    // Check if all targets are the same
    if (this.options.sameTarget && result.length > 1) {
      const t = result[0].to;
      const different = result.some(r => {
        return r.to.player !== t.player
          || r.to.slot !== t.slot
          || r.to.index !== t.index;
      });
      if (different) {
        return false;
      }
    }

    if (this.options.validCardTypes) {
      let onlyValidTypes = true;

      for (const assign of result) {
        const energyCard = assign.card as EnergyCard;

        if (energyCard.provides.every(p => !this.options.validCardTypes!.includes(p))) {
          onlyValidTypes = false;
        }
      }

      return onlyValidTypes;
    }

    // Check if 'different types' restriction is valid
    if (this.options.differentTypes) {
      const typeMap: { [key: number]: boolean } = {};
      for (const assign of result) {
        const cardType = this.getCardType(assign.card);
        if (typeMap[cardType] === true) {
          return false;
        } else {
          typeMap[cardType] = true;
        }
      }
    }

    // Check if all selected targets are different
    if (this.options.differentTargets && result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        const t = result[i].to;
        const index = result.findIndex(r => {
          return r.to.player === t.player
            && r.to.slot === t.slot
            && r.to.index === t.index;
        });
        if (index !== i) {
          return false;
        }
      }
    }

    return result.every(r => r.card !== undefined);
  }
  private getCardType(card: Card): CardType {
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

}
