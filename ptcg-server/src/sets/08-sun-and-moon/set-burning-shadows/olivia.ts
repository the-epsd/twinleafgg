import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, Player, PokemonCard, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Olivia extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '119';
  public name: string = 'Olivia';
  public fullName: string = 'Olivia BUS';
  public text: string =
    'Search your deck for up to 2 Pokémon-GX, reveal them, and put them into your hand. Then, shuffle your deck. You may play only 1 Supporter card during your turn (before your attack).';

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

      const searchBlocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && !card.hasTag(CardTag.POKEMON_GX)) {
          searchBlocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 0, max: 2, allowCancel: true, blocked: searchBlocked },
      );
    }

    return state;
  }
}
