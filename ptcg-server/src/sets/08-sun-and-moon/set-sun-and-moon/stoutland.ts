import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Stoutland extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Herdier';
  public cardType: CardType[] = [C];
  public hp: number = 150;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ferocious Bellow',
    cost: [C, C, C],
    damage: 50,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 50 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Hammer In',
    cost: [C, C, C, C],
    damage: 120,
    text: ''
  }];

  public set: string = 'SUM';
  public setNumber: string = '105';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stoutland';
  public fullName: string = 'Stoutland SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ferocious Bellow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 50);
    }

    return state;
  }
}
