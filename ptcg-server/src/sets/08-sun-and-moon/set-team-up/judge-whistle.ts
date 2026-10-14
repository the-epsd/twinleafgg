import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import {
  DRAW_CARDS,
  MOVE_CARDS,
  SELECT_PROMPT_WITH_OPTIONS,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class JudgeWhistle extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '146';
  public name: string = 'Judge Whistle';
  public fullName: string = 'Judge Whistle TEU';
  public text: string = `Choose 1:

  • Draw a card.
  • Put a Judge card from your discard pile into your hand.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Need a Judge in the discard pile or a card to draw
    const isJudgeInDiscard = player.discard.cards.some(
      (c) => c instanceof TrainerCard && c.name === 'Judge',
    );
    return isJudgeInDiscard || player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const isJudgeInDiscard = player.discard.cards.some(
        (c) => c instanceof TrainerCard && c.name === 'Judge',
      );

      if (!isJudgeInDiscard && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // if there's no judge, just draw
      if (!isJudgeInDiscard) {
        DRAW_CARDS(store, state, player, 1);
        return state;
      }

      return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, [
        {
          // grab a judge
          message: GameMessage.CHOOSE_SUPPORTER_FROM_DISCARD,
          action: () => {
            SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
              store,
              state,
              player,
              this,
              { superType: SuperType.TRAINER, name: 'Judge' },
              { min: 1, max: 1, allowCancel: false },
            );
          },
        },
        {
          message: GameMessage.DRAW,
          action: () => {
            DRAW_CARDS(store, state, player, 1);
          },
        },
      ]);
    }

    return state;
  }
}
