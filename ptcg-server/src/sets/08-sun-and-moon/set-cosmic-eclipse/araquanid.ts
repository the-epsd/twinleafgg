import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Araquanid extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dewpider';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Headstrike',
    cost: [C, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Liquidation',
    cost: [W, C, C],
    damage: 80,
    text: 'During your next turn, the Defending Pokémon takes 60 more damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'CEC';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Araquanid';
  public fullName: string = 'Araquanid CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Liquidation
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 60);
    }

    return state;
  }
}
