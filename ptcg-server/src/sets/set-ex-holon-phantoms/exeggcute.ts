import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Exeggcute extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Pebble Throw',
    cost: [F, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Benched Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Exeggcute';
  public fullName: string = 'Exeggcute HP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }
}