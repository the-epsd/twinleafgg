import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface SelectOptionOptions {
  allowCancel: boolean;
  defaultValue: number;
  disabled?: boolean[];
}

export class SelectOptionPrompt extends Prompt<number> {

  readonly type: string = 'SelectOption';

  public options: SelectOptionOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public values: string[],
    options?: Partial<SelectOptionOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      defaultValue: 0,
    }, options);
  }
} 