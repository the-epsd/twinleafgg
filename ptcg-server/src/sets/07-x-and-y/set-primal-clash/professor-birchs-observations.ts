import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, Player } from '../../../game';
import { COIN_FLIP_PROMPT, DRAW_CARDS, SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ProfessorBirchsObservations extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '134';
  public name: string = "Professor Birch's Observations";
  public fullName: string = "Professor Birch's Observations PRC";
  public text: string =
    'Shuffle your hand into your deck and flip a coin. If heads, draw 7 cards. If tails, draw 4 cards. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, effect.player, {
        excludeCard: this,
        resolveDraw: (store, state, player) => {
          COIN_FLIP_PROMPT(store, state, player, (result) => {
            DRAW_CARDS(store, state, player, result ? 7 : 4);
          });
        },
      });
    }

    return state;
  }
}
