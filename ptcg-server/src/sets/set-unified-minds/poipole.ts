import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Poipole extends PokemonCard {
  public tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Belt',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Last Scene',
      cost: [P, C, C],
      damage: 50,
      damageCalculation: '+' as '+',
      text: 'If each player has exactly 1 Prize card remaining, this attack does 130 more damage.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '102';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Poipole';
  public fullName: string = 'Poipole UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Last Scene
    // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() === 1 && opponent.getPrizeLeft() === 1) {
        effect.damage += 130;
      }
    }

    return state;
  }
}
