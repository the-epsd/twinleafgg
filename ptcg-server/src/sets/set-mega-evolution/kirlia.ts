import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Card } from '../../game/store/card/card';

function* useCallSign(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 0, max: 3, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ralts';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [{
    name: 'Call Sign',
    cost: [P],
    damage: 0,
    text: 'Search your deck for up to 3 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Psyshot',
    cost: [P],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M1S';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia M1S';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCallSign(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
} 