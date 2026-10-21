import { Card, CardTag, ChooseCardsPrompt, EnergyCard, EnergyType, GameError, GameMessage, Player, State, StateUtils, StoreLike, SuperType, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const uniqueBasicEnergies = player.deck.cards
    .filter((c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC)
    .map((e) => (e as EnergyCard).provides[0])
    .filter((value, index, self) => self.indexOf(value) === index).length;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 0, max: uniqueBasicEnergies, allowCancel: false, differentTypes: true },
    ),
    (selected) => {
      cards = selected || [];

      if (cards.length > 1 && cards[0].name === cards[1].name) {
        throw new GameError(GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
      }

      next();
    },
  );

  MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: effect.trainerCard });
  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  return SHUFFLE_DECK(store, state, player);
}

export class EnergySearchPro extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  protected _tags = [CardTag.ACE_SPEC];
  public regulationMark = 'H';
  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '176';
  public name: string = 'Energy Search Pro';
  public fullName: string = 'Energy Search Pro SSP';
  public text: string = 'Search your deck for any number of Basic Energy cards of different types, reveal them, and put them into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
