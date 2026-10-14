import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { Player } from '../../../game';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AdventurersDiscovery extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '224';
  public name: string = "Adventurer's Discovery";
  public fullName: string = "Adventurer's Discovery FST";
  public text: string =
    'Search your deck for up to 3 Pokémon V, reveal them, and put them into your hand. Then, shuffle your deck.';

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

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (
          !card.hasTag(CardTag.POKEMON_V) &&
          !card.hasTag(CardTag.POKEMON_VSTAR) &&
          !card.hasTag(CardTag.POKEMON_VMAX)
        ) {
          blocked.push(index);
        }
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 0, max: 3, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
