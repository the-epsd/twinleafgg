import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cramorant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 20,
    text: ''
  }, {
    name: 'Spit Shot',
    cost: [C, C, C],
    damage: 0,
    text: 'Discard all Energy from this Pokémon. This attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Cramorant';
  public fullName: string = 'Cramorant TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spit Shot
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(120, effect, store, state);
    }

    return state;
  }
}
