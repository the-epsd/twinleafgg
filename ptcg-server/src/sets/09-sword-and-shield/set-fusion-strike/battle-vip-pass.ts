import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  MOVE_CARDS,
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BattleVIPPass extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '225';
  public name: string = 'Battle VIP Pass';
  public fullName: string = 'Battle VIP Pass FST';
  public text: string = `You can use this card only during your first turn.

Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const turn = state.turn;

    if (turn > 2) {
      return false;
    }

    const openSlots = player.bench.filter((b) => b.cards.length === 0);

    if (player.deck.cards.length === 0 || openSlots.length === 0) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const turn = state.turn;

      if (turn > 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const player = effect.player;
      const openSlots = player.bench.filter((b) => b.cards.length === 0);

      if (player.deck.cards.length === 0 || openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const maxCards = Math.min(2, openSlots.length);

      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        player,
        { stage: Stage.BASIC },
        { min: 0, max: maxCards, allowCancel: false },
      );
    }
    return state;
  }
}
