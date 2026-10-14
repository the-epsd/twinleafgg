import { Card } from '../../../game/store/card/card';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { TrainerType, EnergyType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../../game/store/prompts/shuffle-prompt';
import { Player } from '../../../game';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: SuperRod,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  let eligibleCount = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isPokemon = c instanceof PokemonCard;
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    if (isPokemon || isBasicEnergy) {
      eligibleCount += 1;
    } else {
      blocked.push(index);
    }
  });

  if (eligibleCount === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  let min: number;
  let max: number;
  if (eligibleCount <= 3) {
    min = eligibleCount;
    max = eligibleCount;
  } else {
    min = 3;
    max = 3;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      {},
      { min, max, allowCancel: false, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: self });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), (order) => {
    player.deck.applyOrder(order);
  });
}

export class SuperRod extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'NVI';
  public name: string = 'Super Rod';
  public fullName: string = 'Super Rod NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public text: string =
    'Shuffle 3 in any combination of Pokemon and basic Energy cards from ' +
    'your discard pile back into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.discard.cards.some(
      (c) =>
        c instanceof PokemonCard || (c instanceof EnergyCard && c.energyType === EnergyType.BASIC),
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
