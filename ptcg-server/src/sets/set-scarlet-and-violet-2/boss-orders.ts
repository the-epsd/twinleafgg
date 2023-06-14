import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, StateUtils, GameError, GameMessage } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), result => {
    const cardList = result[0];
    opponent.switchPokemon(cardList);
  });
}

export class BossOrders extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL-EN';

  public name: string = 'Boss\'s Orders';

  public fullName: string = 'Boss\'s Orders PAL-EN 172';

  public text: string =
    'Switch in your opponent\'s Benched Pokemon to the ' +
    'Active Spot.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
