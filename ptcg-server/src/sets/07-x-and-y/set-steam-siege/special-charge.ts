import { Card, ChooseCardsPrompt, GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(next: Function, store: StoreLike, state: State, self: SpecialCharge, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const specialEnergyCards = player.discard.cards.filter((c) => {
    return c.superType === SuperType.ENERGY && c.energyType === EnergyType.SPECIAL;
  }).length;

  if (specialEnergyCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const min = Math.min(2, specialEnergyCards);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
      { min, max: 2, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > 0) {
    MOVE_CARDS(store, state, player.discard, player.deck, { cards: cards, sourceCard: self });
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  return SHUFFLE_DECK(store, state, player);
}

export class SpecialCharge extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Special Charge';
  public fullName: string = 'Special Charge STS';
  public text: string = 'Shuffle 2 Special Energy cards from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.discard.cards.some((c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.SPECIAL);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
