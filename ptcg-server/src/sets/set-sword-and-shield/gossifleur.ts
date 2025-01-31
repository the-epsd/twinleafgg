import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

function* useCallForFamily(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 3);

  if (max === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
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

export class Gossifleur extends PokemonCard {
  public regulationMark = 'D';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Call For Family',
      cost: [ C ],
      damage: 0,
      text: 'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Razor Leaf',
      cost: [ G ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Gossifleur';
  public fullName: string = 'Gossifleur SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCallForFamily(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}