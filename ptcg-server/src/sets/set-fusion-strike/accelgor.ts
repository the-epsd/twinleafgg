import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Accelgor extends PokemonCard {

  public tags = [ CardTag.FUSION_STRIKE ];

  public regulationMark = 'E';
  
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shelmet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Grass Tornado',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack can be used for [G].'
    }
  ];


  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Accelgor';

  public fullName: string = 'Accelgor FST';



  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
      console.log('movedToActiveThisTurn = false');
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      if (this.movedToActiveThisTurn) {
        effect.cost = [ CardType.GRASS ];
      }
    }
    return state;
  }
}