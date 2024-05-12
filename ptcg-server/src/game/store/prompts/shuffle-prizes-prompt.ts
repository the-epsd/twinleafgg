import { Prompt } from './prompt';
import { State } from '../state/state';

export class ShufflePrizesPrompt extends Prompt<number[]> {

  readonly type: string = 'Shuffle prizes';

  constructor(playerId: number) {
    super(playerId);
  }

  public validate(result: number[] | null, state: State): boolean {
    if (result === null) {
      return false;
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      return false;
    }
    if (result.length !== player.prizes.reduce((sum, cardList) => sum + cardList.cards.length, 0)) {
      return false;
    }
    const s = result.slice();
    s.sort();
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== i) {
        return false;
      }
    }
    return true;
  }

}
