import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils
} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class Raichu extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Ambushing Spark',
      cost: [CardType.COLORLESS],
      damage: 40,
      damageCalculation: '+',
      text: 'If your opponent has used their VSTAR Power during this game, this attack does 100 more damage.'
    },
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.usedVSTAR == true) {
        effect.damage += 100;
      }
      return state;
    }
    return state;
  }
}