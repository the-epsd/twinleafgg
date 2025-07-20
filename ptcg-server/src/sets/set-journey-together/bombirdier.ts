import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Bombirdier extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Glide',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Drop Shot',
    cost: [D, D, C],
    damage: 0,
    text: 'Discard all Energy from this Pokémon, and this attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name = 'Bombirdier';
  public fullName = 'Bombirdier JTG';
  public regulationMark = 'H';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(120, effect, store, state);
    }

    return state;
  }

}