import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ShowCardsPrompt, TrainerCard, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MissingClover extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Missing Clover';
  public fullName: string = 'Missing Clover UPR';
  public text: string =
    'You may play 4 Missing Clover cards at once.\n\u2022 If you played 1 card, look at the top card of your deck.\n\u2022 If you played 4 cards, take a Prize card. (This effect works one time for 4 cards.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  // TODO: Playing 4 Missing Clover at once is not supported by the engine (one Item is played at a time).
  // Only the single-card effect is implemented: look at the top card of your deck.
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length > 0) {
        const topCard = [player.deck.cards[0]];
        store.prompt(
          state,
          new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, topCard),
          () => {},
        );
      }
    }

    return state;
  }
}
