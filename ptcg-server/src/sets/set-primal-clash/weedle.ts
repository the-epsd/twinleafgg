import { Card, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, PokemonCardList, ShuffleDeckPrompt, Stage, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useMultiply(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  if (slots.length == 0) { return state; } // Attack does nothing if no bench slots.
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Weedle' },
    { min: 0, max, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Weedle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Multiply',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Search your deck for Weedle and put it onto your Bench. Shuffle your deck afterward.'
    },
  ];

  public set: string = 'PRC';

  public name: string = 'Weedle';

  public fullName: string = 'Weedle PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Multiply
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useMultiply(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}