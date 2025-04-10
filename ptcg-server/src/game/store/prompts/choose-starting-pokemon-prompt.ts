import { Card } from '../card/card';
import { CardList } from '../state/card-list';
import { GameMessage } from '../../game-message';
import { Player } from '../state/player';
import { Prompt } from './prompt';

export const ChooseStartingPokemonPromptType = 'Choose starting pokemon';

export interface ChooseStartingPokemonOptions {
  blocked: number[];
  allowCancel: boolean;
}

export class ChooseStartingPokemonPrompt extends Prompt<Card[]> {
  readonly type: string = ChooseStartingPokemonPromptType;
  public options: ChooseStartingPokemonOptions;

  constructor(
    player: Player,
    public message: GameMessage,
    public cards: CardList,
    options?: Partial<ChooseStartingPokemonOptions>
  ) {
    super(player.id);

    // Default options
    this.options = Object.assign({}, {
      blocked: [],
      allowCancel: false
    }, options);
  }

  public validate(result: Card[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }

    // Must select exactly one card
    if (result.length !== 1) {
      return false;
    }

    // Card must be in the available cards list
    const selectedCard = result[0];
    const cardIndex = this.cards.cards.findIndex(c => c.id === selectedCard.id);
    if (cardIndex === -1 || this.options.blocked.includes(cardIndex)) {
      return false;
    }

    return true;
  }
} 