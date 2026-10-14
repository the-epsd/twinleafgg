import { TrainerType, SuperType, EnergyType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Lady extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '159';
  public name: string = 'Lady';
  public fullName: string = 'Lady LOR';
  public text: string =
    'Search your deck for up to 4 basic Energy cards, reveal ' +
    'them, and put them into your hand. Then, shuffle ' +
    'your deck.';

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
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 4, allowCancel: true },
      );
    }

    return state;
  }
}
