import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsHypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Drowzee';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [ P ],
      damage: 40,
      text: ''
    },
    {
      name: 'Bench Manipulation',
      cost: [ P, P, P ],
      damage: 80,
      damageCalculation: 'x',
      text: 'Your opponent flips a coin for each of their Benched Pokemon. This attack does 80 damage for each tails. Don\'t apply Weakness and Resistance for this attack\'s damage.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Hypno';
  public fullName: string = 'Team Rocket\'s Hypno SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      let tails = 0;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (opponent.active === card){
          return;
        }
        
        COIN_FLIP_PROMPT(store, state, effect.player, result => { 
          if (!result){
            tails++; 
          } 
        });
      });

      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      effect.damage = (80 * tails);
    }

    return state;
  }
}
