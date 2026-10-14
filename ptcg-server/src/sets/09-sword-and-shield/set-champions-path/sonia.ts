import { GameError, Player, PokemonCard } from '../../../game';
import { GameMessage } from '../../../game/game-message';
import { Card } from '../../../game/store/card/card';
import { EnergyType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Sonia,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    // eslint-disable-next-line no-empty
    if (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC) {
      // eslint-disable-next-line no-empty
    } else if (c instanceof PokemonCard && c.stage === Stage.BASIC) {
    } else {
      blocked.push(index);
    }
  });

  // Pass max counts to prompt options
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND,
      player.deck,
      {},
      { min: 0, max: 2, allowCancel: false, blocked, allowDifferentSuperTypes: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });

  if (cards.length > 0) {
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  SHUFFLE_DECK(store, state, player);
  CLEAN_UP_SUPPORTER(store, effect, player);
  return state;
}

export class Sonia extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'D';
  public set: string = 'CPA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Sonia';
  public fullName: string = 'Sonia CPA';
  public text: string =
    'Search your deck for up to 2 Basic Pokémon or up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.';

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
