import { Card, EnergyType, GameError, GameMessage, Player, State, StateUtils, StoreLike, SuperType, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function hasBasicEnergyInDiscard(player: Player): boolean {
  return player.discard.cards.some(
    (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC,
  );
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: EnergyReturner,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let energyInDiscard = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isBasicEnergy = c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC;
    if (isBasicEnergy) {
      energyInDiscard += 1;
    } else {
      blocked.push(index);
    }
  });

  if (energyInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  const min = Math.min(energyInDiscard, 4);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min, max: 4, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: self });

  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  return SHUFFLE_DECK(store, state, player);
}

export class EnergyReturner extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Energy Returner';
  public fullName: string = 'Energy Returner UL';
  public text: string =
    'Search your discard pile for 4 basic Energy cards, show them to your opponent, and shuffle them into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return hasBasicEnergyInDiscard(player);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      if (!hasBasicEnergyInDiscard(effect.player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
