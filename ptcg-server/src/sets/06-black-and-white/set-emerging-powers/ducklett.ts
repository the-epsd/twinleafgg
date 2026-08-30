import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_SELF_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Ducklett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Roost',
    cost: [C],
    damage: 0,
    text: 'Heal 40 damage from this Pokémon. This Pokémon can\'t retreat during your next turn.'
  },
  {
    name: 'Rain Splash',
    cost: [W, W],
    damage: 20,
    text: ''
  }];

  public set: string = 'EPO';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ducklett';
  public fullName: string = 'Ducklett EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roost
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
      BLOCK_SELF_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
