import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TypeNull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Merciless Stike',
      cost: [ C, C ],
      damage: 30,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 30 more damage. '
    },
    {
      name: 'Headbang',
      cost: [ C, C, C ],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Type: Null';
  public fullName: string = 'Type: Null UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      if (effect.opponent.active.damage > 0){ effect.damage += 30; }
    }
    
    return state;
  }
}
