import { Card, GameError, GameMessage, Player, State, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ShowCardsPrompt } from '../../../game/store/prompts/show-cards-prompt';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  const prizes = player.prizes.filter((p) => p.isSecret);
  const cards: Card[] = [];
  prizes.forEach((p) => {
    p.cards.forEach((c) => cards.push(c));
  });

  if (cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  prizes.forEach((p) => {
    p.isSecret = false;
  });

  yield store.prompt(
    state,
    new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, cards),
    () => {
      next();
    },
  );

  prizes.forEach((p) => {
    p.isSecret = true;
  });

  return state;
}

export class AlphLithograph extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'FOUR';
  public name: string = 'Alph Lithograph';
  public fullName: string = 'Alph Lithograph TM';
  public text: string = 'LOOK AT ALL OF YOUR FACE DOWN PRIZE CARDS!';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.prizes.some((p) => p.isSecret);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      if (!player.prizes.some((p) => p.isSecret)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
