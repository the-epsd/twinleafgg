import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';

function* useFlock(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 2);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Froakie' },
    { min: 0, max, allowCancel: false }
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

export class Froakie extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flock',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Search your deck for up to 2 Froakie and put them onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Flop',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Froakie';

  public fullName: string = 'Froakie TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFlock(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
