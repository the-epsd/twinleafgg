import { CardList, ChooseCardsPrompt, GameError, GameMessage, Player } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Hapu extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '200';
  public name: string = 'Hapu';
  public fullName: string = 'Hapu UNM';
  public text: string =
    'Look at the top 6 cards of your deck and put 2 of them into your hand. Discard the other cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 6, sourceCard: this });

      const min = Math.min(2, deckTop.cards.length);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          deckTop,
          {},
          { min, max: 2, allowCancel: false },
        ),
        (selected) => {
          MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected, sourceCard: this });
          MOVE_CARDS(store, state, deckTop, player.discard, { sourceCard: this });
        },
      );
    }

    return state;
  }
}
