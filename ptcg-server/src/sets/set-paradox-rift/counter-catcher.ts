import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);
  
  if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), result => {
    const cardList = result[0];
    opponent.switchPokemon(cardList);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });
}
  
export class CounterCatcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '160';

  public regulationMark = 'G';

  public name: string = 'Counter Catcher';

  public fullName: string = 'Counter Catcher PAR';

  public text: string =
    'You can play this card only if you have more Prize cards remaining than your opponent.' +
    '' +
    'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.';

  public readonly COUNTER_CATCHER_MARKER = 'COUNTER_CATCHER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
