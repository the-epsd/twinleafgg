import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LysandresTrumpCard extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = "Lysandre's Trump Card";
  public fullName: string = 'Lysandres Trump Card PHF';
  public text: string =
    "Each player shuffles all cards in his or her discard pile into his or her deck (except for Lysandre's Trump Card).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      [player, opponent].forEach((owner) => {
        const cards = owner.discard.cards.filter((c) => c.name !== this.name);
        MOVE_CARDS(store, state, owner.discard, owner.deck, { cards, sourceCard: this });
        SHUFFLE_DECK(store, state, owner);
      });
    }

    return state;
  }
}
