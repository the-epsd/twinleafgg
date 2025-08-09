import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect, TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, StateUtils, GameError, GameMessage } from '../../game';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), result => {
    const cardList = result[0];

    if (cardList) {
      const targetCard = new TrainerTargetEffect(player, effect.trainerCard, cardList);
      targetCard.target = cardList;
      store.reduceEffect(state, targetCard);
      if (targetCard.target) {
        opponent.switchPokemon(targetCard.target);
      }
    }

    CLEAN_UP_SUPPORTER(effect, player);
    return state;
  });
}


export class GustOfWind extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '93';

  public name: string = 'Gust of Wind';

  public fullName: string = 'Gust of Wind BS';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
    'Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
