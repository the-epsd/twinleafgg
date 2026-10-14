import { TrainerCard } from '../../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { GameMessage } from '../../../game/game-message';
import { StoreLike, State, PokemonCard, GameError, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class FeatherBall extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Feather Ball';
  public fullName: string = 'Feather Ball ASR';
  public text =
    'Search your deck for 1 Pokemon with no retreat cost, ' +
    'show it to your opponent, and put it into your hand. ' +
    'Shuffle your deck afterward.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
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

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.retreat.length !== 0) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
