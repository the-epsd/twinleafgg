import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { StateUtils } from '../state-utils';
import { State } from '../state/state';
import { PokemonCardList } from '../state/pokemon-card-list';

export const ChooseToolPromptType = 'Choose tool';

export interface ChooseToolOptions {
  min: number;
  max: number;
  allowCancel: boolean;
}

export class ChooseToolPrompt extends Prompt<Card[]> {

  readonly type: string = ChooseToolPromptType;

  public options: ChooseToolOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public tools: Card[],
    options?: Partial<ChooseToolOptions>
  ) {
    super(playerId);
    // Default options
    this.options = Object.assign({}, {
      min: 1,
      max: 1,
      allowCancel: true,
    }, options);
  }

  public decode(result: number[] | null): Card[] | null {
    if (result === null) {
      return null;
    }
    const tools: Card[] = this.tools;
    return result.map(index => tools[index]);
  }

  public validate(result: Card[] | null, state: State): boolean {
    if (result === null || result.length === 0) {
      return this.options.allowCancel;
    }
    if (result.length > this.options.max || result.length < this.options.min || result.some(card => !(this.tools.includes(card)))) {
      return false;
    }
    for (const tool of result) {
      const cardList = StateUtils.findCardList(state, tool);
      if (!(cardList instanceof PokemonCardList) || (cardList.tools.includes(tool))) {
        return false;
      }
    }
    return true;
  }

}
