import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, Card, ChooseCardsPrompt, StateUtils } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Delinquent extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Delinquent';
  public fullName: string = 'Delinquent BKP';
  public text: string =
    'Discard any Stadium card in play. If you do, your opponent discards 3 cards from his or her hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return StateUtils.getStadiumCard(state) !== undefined;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [this], sourceCard: this });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Discard Stadium
      const stadiumList = StateUtils.findCardList(state, stadiumCard);
      const stadiumOwner = StateUtils.findOwner(state, stadiumList);
      MOVE_CARDS(store, state, stadiumList, stadiumOwner.discard, { sourceCard: this });

      // Discard 3 cards from opponent's hand
      const opponentCards = opponent.hand.cards;
      if (opponentCards.length <= 3) {
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { sourceCard: this });
      }

      if (opponentCards.length > 3) {
        let cards: Card[] = [];

        state = store.prompt(
          state,
          new ChooseCardsPrompt(
            opponent,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.hand,
            {},
            { min: 3, max: 3, allowCancel: false },
          ),
          (selected) => {
            cards = selected || [];
            MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards, sourceCard: this });
          },
        );
      }
    }

    return state;
  }
}
