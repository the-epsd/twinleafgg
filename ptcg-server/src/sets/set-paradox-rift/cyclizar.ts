import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cyclizar extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Ram',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Driving Buddy',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      damageCalculation: '+',
      text: 'If you played a Supporter card from your hand during this turn, this attack does 70 more damage.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Cyclizar';

  public fullName: string = 'Cyclizar PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;

      if (player.supporterTurn >= 1) {
        effect.damage += 70;
      }

    }
    return state;
  }
}