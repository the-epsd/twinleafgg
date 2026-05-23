import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Escavalier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Karrablast';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Slash',
      cost: [M, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Guard Press',
      cost: [M, C, C],
      damage: 60,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Escavalier';
  public fullName: string = 'Escavalier NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    return state;
  }
}
