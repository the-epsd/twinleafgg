import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

export class Will extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '208';
  public name: string = 'Will';
  public fullName: string = 'Will CEC';
  public text: string =
    'The next time you flip any number of coins for the effect of an attack, Ability, or Trainer card this turn, choose heads or tails for the first coin flip. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // TODO: Will's effect ("choose heads or tails for the first coin flip") requires
    // intercepting CoinFlipPrompt at the engine level to override the first coin flip result.
    // This is not currently implementable in the engine, so the card is played as a plain Supporter.
    return state;
  }
}
