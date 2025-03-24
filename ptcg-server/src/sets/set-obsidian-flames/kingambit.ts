import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike,State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';

export class Kingambit extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Bisharp';
  public cardType: CardType = M;
  public hp: number = 180;
  public weakness = [{ type: F }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [ C, C, C, C ];

  public attacks = [
    {
      name: 'Strike Down',
      cost: [ M ],
      damage: 0,
      text: 'If your opponent\'s Active Pokémon has 4 or more damage counters on it, that Pokémon is Knocked Out.'
    },
    {
      name: 'Massive Rend',
      cost: [ M, C, C ],
      damage: 140,
      text: ''
    }    
  ];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Kingambit';
  public fullName: string = 'Kingambit OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strike Down
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      if (opponent.active.damage === 40){
        const knockout = new KnockOutOpponentEffect(effect, 999);
        knockout.target = opponent.active;
        store.reduceEffect(state, knockout);
      }
    }
    
    return state;
  }
}
