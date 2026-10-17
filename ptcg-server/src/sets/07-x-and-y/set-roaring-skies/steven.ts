import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils, Card, ChooseCardsPrompt } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Steven,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const allFound: Card[] = [];

  // Step 1: Search for a Supporter card (private knowledge - can fail)
  const supporterBlocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof TrainerCard) || card.trainerType !== TrainerType.SUPPORTER) {
      supporterBlocked.push(index);
    }
  });

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { min: 0, max: 1, allowCancel: true, blocked: supporterBlocked },
    ),
    (selected) => {
      allFound.push(...(selected || []));
      next();
    },
  );

  // Step 2: Search for a basic Energy card (private knowledge - can fail)
  const energyBlocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof EnergyCard) || card.energyType !== EnergyType.BASIC) {
      energyBlocked.push(index);
    }
  });

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 0, max: 1, allowCancel: true, blocked: energyBlocked },
    ),
    (selected) => {
      allFound.push(...(selected || []));
      next();
    },
  );

  // Reveal and move to hand
  if (allFound.length > 0) {
    MOVE_CARDS(store, state, player.deck, player.hand, { cards: allFound, sourceCard: self });
    SHOW_CARDS_TO_PLAYER(store, state, opponent, allFound);
  }

  return SHUFFLE_DECK(store, state, player);
}

export class Steven extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Steven';
  public fullName: string = 'Steven ROS';
  public text: string =
    'Search your deck for a Supporter card and a basic Energy card, reveal them, and put them into your hand. Shuffle your deck afterward. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
