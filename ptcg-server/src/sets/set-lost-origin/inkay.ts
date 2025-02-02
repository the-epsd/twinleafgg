import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useCallForFamily(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 2);

  if (slots.length === 0) {
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

export class Inkay extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 50;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Call for Family',
    cost: [CardType.DARK],
    damage: 0,
    text: ' Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck. '
  },
  {
    name: 'Tackle',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'LOR';
  public regulationMark: string = 'F';
  public fullName: string = 'Inkay LOR';
  public name: string = 'Inkay';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCallForFamily(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}