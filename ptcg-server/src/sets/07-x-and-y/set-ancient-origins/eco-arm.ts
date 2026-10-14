import { Card, GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import {
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: EcoArm,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const toolCards = player.discard.cards.filter(
    (c) => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL,
  ).length;

  if (toolCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  const min = Math.min(3, toolCards);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      { min, max: 3, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > 0) {
    MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: self });
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  SHUFFLE_DECK(store, state, player);
  CLEAN_UP_SUPPORTER(store, effect, player);
  return state;
}

export class EcoArm extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Eco Arm';
  public fullName: string = 'Eco Arm AOR';
  public text: string = 'Shuffle 3 Pokémon Tool cards from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.discard.cards.some(
      (c) => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL,
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
