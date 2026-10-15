import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: 10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [],
    damage: 10,
    text: ''
  },
{
    name: 'Lava Burn',
    cost: [R, R],
    damage: 20,
    text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Charmander';
  public fullName: string = 'Charmander SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lava Burn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
    }

    return state;
  }
}
