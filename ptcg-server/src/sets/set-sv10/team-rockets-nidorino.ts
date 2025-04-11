import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class TeamRocketsNidorino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Nidoran M';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [D, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Horned Gouge',
      cost: [D, D, C],
      damage: 60,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 60 more damage.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Nidorino';
  public fullName: string = 'Team Rocket\'s Nidorino SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Horned Gouge
    if (WAS_ATTACK_USED(effect, 1, this)){
      if (effect.opponent.active.damage > 0){
        effect.damage += 60;
      }
    }
    
    return state;
  }
}
