import { GameError, GameMessage, PlayerType, PokemonCardList, SlotType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!opponentHasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  
  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    opponent.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length > 0) {
    opponent.active.clearEffects();
    opponent.switchPokemon(targets[0]);
  }
  
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return state;
}

export class Repel extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SUM';

  public name: string = 'Repel';

  public fullName: string = 'Repel SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public text: string =
    'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
