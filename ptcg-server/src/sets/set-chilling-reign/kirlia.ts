import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage,
  ChooseCardsPrompt,
  Card,
  PokemonCardList,
  ShuffleDeckPrompt} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useMirageStep(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 3);
  
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, name: 'Kirlia' },
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

export class Kirlia extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Mirage Step',
      cost: [ CardType.PSYCHIC ],
      damage: 0,
      text: 'Search your deck for up to 3 Kirlia and put them onto your Bench. Then, shuffle your deck.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia CRE';

  public readonly REFINEMENT_MARKER = 'REFINEMENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useMirageStep(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}