import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useKingsOrder(next: Function, store: StoreLike, state: State,
  effect: AttackEffect, self: Card): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

  const hasBasicInDiscard = player.hand.cards.some(c => {
    return c instanceof PokemonCard && c.stage === Stage.BASIC;
  });
  if (!hasBasicInDiscard) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.discard,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    MOVE_CARDS(store, state, player.discard, slots[index], { cards: [card], sourceCard: self });
    slots[index].pokemonPlayedTurn = state.turn;
  });
}

export class Duskull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dark Guidance',
    cost: [P],
    damage: 0,
    text: 'Put a Basic Pokémon from your discard pile onto your Bench.'
  },
  {
    name: 'Spooky Shot',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Duskull';
  public fullName: string = 'Duskull BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useKingsOrder(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }

}
