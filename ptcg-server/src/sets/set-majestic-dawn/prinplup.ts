import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Prinplup extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Piplup';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Ice Blade',
    cost: [W, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Wash Over',
    cost: [W, C, C],
    damage: 50,
    text: 'Does 10 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Prinplup';
  public fullName: string = 'Prinplup MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state, 2, 2);
    }

    return state;
  }
}