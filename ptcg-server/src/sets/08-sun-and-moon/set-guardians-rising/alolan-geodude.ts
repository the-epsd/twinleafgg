import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, THIS_POKEMON_HAS_NO_RETREAT_COST_DURING_YOUR_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class AlolanGeodude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rock Polish',
    cost: [],
    damage: 0,
    text: 'During your next turn, this Pokémon has no Retreat Cost.'
  },
  {
    name: 'Rollout',
    cost: [L, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'GRI';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Geodude';
  public fullName: string = 'Alolan Geodude GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_HAS_NO_RETREAT_COST_DURING_YOUR_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
