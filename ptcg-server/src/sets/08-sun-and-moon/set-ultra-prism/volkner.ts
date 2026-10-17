import {
  Card,
  ChooseCardsPrompt,
  EnergyCard,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { EnergyType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Volkner,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Count energy and items separately
  let energy = 0;
  let items = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (
      c instanceof EnergyCard &&
      c.energyType === EnergyType.BASIC &&
      c.name === 'Lightning Energy'
    ) {
      energy += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
      items += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxEnergies = Math.min(energy, 1);
  const maxItems = Math.min(items, 1);
  const count = maxEnergies + maxItems;

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_ONE_ITEM_AND_ONE_LIGHTNING_ENERGY_TO_HAND,
      player.deck,
      {},
      { min: 0, max: count, allowCancel: false, blocked, maxEnergies, maxItems },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });
  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  return SHUFFLE_DECK(store, state, player);
}

export class Volkner extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Volkner';
  public fullName: string = 'Volkner UPR';
  public text: string =
    'Search your deck for an Item card and a [L] Energy card, reveal them, and put them into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
