import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Card, ChooseCardsPrompt, GameMessage, PokemonCardList, ShuffleDeckPrompt } from '../../game';

function* useFlock(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard &&
      !['Silcoon', 'Cascoon'].includes(card.name)) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 0, max, allowCancel: false, blocked }
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

export class Cascoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wurmple';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Cocoon Collector',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 4 in any combination of Silcoon and Cascoon and put them onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Ram',
      cost: [G, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'LOT';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cascoon';
  public fullName: string = 'Cascoon LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFlock(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
