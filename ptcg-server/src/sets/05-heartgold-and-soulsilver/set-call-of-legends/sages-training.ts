import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { CardList, ChooseCardsPrompt, GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class SagesTraining extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = "Sage's Training";
  public fullName: string = "Sage's Training CL";
  public text: string =
    'Look at the top 5 cards of your deck. Choose any 2 cards you find there and put them into your hand. Discard the other cards.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.ancientSupporter) {
      effect.player.ancientSupporter = false;
    }

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
      effect.preventDefault = true;

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 5, sourceCard: this });

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
          player.ancientSupporter = true;
          MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected, sourceCard: this });
          MOVE_CARDS(store, state, deckTop, player.discard, { sourceCard: this });
        },
      );
    }

    return state;
  }
}
