import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { State } from '../../../game/store/state/state';
import { Player } from '../../../game/store/state/player';
import { StoreLike } from '../../../game/store/store-like';

export class Lusamine extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Lusamine';
  public fullName: string = 'Lusamine CIN';
  public text: string =
    'Put 2 in any combination of Supporter and Stadium cards from your discard pile into your hand.';

  private isSupporterOrStadium(card: TrainerCard | unknown): boolean {
    return (
      card instanceof TrainerCard &&
      (card.trainerType === TrainerType.STADIUM || card.trainerType === TrainerType.SUPPORTER)
    );
  }

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (!player.discard.cards.some((c) => this.isSupporterOrStadium(c))) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        return state;
      }

      const supportersAndStadiumsInDiscard = player.discard.cards.filter((c) =>
        this.isSupporterOrStadium(c),
      ).length;

      if (supportersAndStadiumsInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (!this.isSupporterOrStadium(c)) {
          blocked.push(index);
        }
      });

      const amount = Math.min(2, supportersAndStadiumsInDiscard);
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: amount, max: amount, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
