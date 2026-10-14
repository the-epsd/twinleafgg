import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameMessage,
  GameError,
  Card,
  ChooseCardsPrompt,
  Player,
  PokemonCard,
  TrainerCard,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: UltraReconSquad,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  if (!self.canPlay(store, state, player)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Block non-Ultra Beast cards (this Supporter is in hand and is blocked too)
  const blocked: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (!(c instanceof PokemonCard && c.hasTag(CardTag.ULTRA_BEAST))) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      {},
      { min: 1, max: 2, allowCancel: false, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });

  // Draw 3 cards for each card discarded
  DRAW_CARDS(store, state, player, cards.length * 3);

  return state;
}

export class UltraReconSquad extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Ultra Recon Squad';
  public fullName: string = 'Ultra Recon Squad FLI';
  public text: string =
    'Discard up to 2 Ultra Beast cards from your hand. Draw 3 cards for each card you discarded in this way. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.hand.cards.some((c) => c instanceof PokemonCard && c.hasTag(CardTag.ULTRA_BEAST));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
