import { PokemonCard, Stage, CardType, StoreLike, State, SuperType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #37 — Energized Tail + Pika Punch */
export class Pikachu37 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Energized Tail',
    cost: [C],
    damage: 0,
    text: 'Search your deck for an Energy card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Pika Punch',
    cost: [L, C],
    damage: 30,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 37';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energized Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store, state, effect.player, this,
        { superType: SuperType.ENERGY },
        { min: 0, max: 1, allowCancel: false },
        this.attacks[0],
      );
    }
    return state;
  }
}
