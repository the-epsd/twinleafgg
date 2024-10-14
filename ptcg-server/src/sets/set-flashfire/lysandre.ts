import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { SupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, StateUtils, GameError, GameMessage } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);
  const supporterTurn = player.supporterTurn;

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  try {
    const supporterEffect = new SupporterEffect(player, effect.trainerCard);
    store.reduceEffect(state, supporterEffect);
  } catch {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), result => {
    const cardList = result[0];

    if (cardList.stage == Stage.BASIC) {
      try {
        const supporterEffect = new SupporterEffect(player, effect.trainerCard);
        store.reduceEffect(state, supporterEffect);
      } catch {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }
    }

    opponent.switchPokemon(cardList);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  });
}

export class Lysandre extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'FLF';

  public name: string = 'Lysandre';

  public fullName: string = 'Lysandre FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

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
