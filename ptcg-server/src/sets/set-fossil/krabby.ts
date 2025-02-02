import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useCallForFamily(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Krabby' },
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


export class Krabby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 50;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Call for Family',
    cost: [W],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon named Krabby and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench if full.)'
  },
  {
    name: 'Irongrip',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Krabby';
  public fullName: string = 'Krabby FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useCallForFamily(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}