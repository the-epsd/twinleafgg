import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/prefabs';

export class Houndoom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Houndour';
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Snarl',
    cost: [R, C, C],
    damage: 100,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 100 less damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Houndoom';
  public fullName: string = 'Houndoom SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snarl
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 100);
    }

    return state;
  }
}
