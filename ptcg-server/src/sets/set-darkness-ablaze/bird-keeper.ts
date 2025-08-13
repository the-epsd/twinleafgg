import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, GameError, GameMessage, PokemonCardList } from '../../game';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some(b => b.cards.length > 0);

  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  // Do not discard the card yet
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  player.switchPokemon(targets[0]);
  DRAW_CARDS(player, 3);

  CLEAN_UP_SUPPORTER(effect, player);

  return state;
}

export class BirdKeeper extends TrainerCard {

  public regulationMark = 'D';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '159';

  public name: string = 'Bird Keeper';

  public fullName: string = 'Bird Keeper DAA';

  public text: string =
    'Switch your Active Pokemon with 1 of your Benched Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
