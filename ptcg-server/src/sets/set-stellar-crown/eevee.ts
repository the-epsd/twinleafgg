import { Card, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, PokemonCardList, ShuffleDeckPrompt, Stage, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


function* useCallForFamily(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  if (slots.length == 0) { return state; } // Attack does nothing if no bench slots.
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class EeveeSCR extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public set = 'SCR';
  public setNumber = '113';
  public name = 'Eevee';
  public fullName = 'Eevee SCR';
  public regulationMark = 'H';
  public cardImage = 'assets/cardback.png';
  public attacks = [
    {
      name: 'Call for Family',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a Basic Pokemon and put it onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Gnaw',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: '',
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCallForFamily(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}