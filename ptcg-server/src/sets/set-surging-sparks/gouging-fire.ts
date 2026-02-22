import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GougingFire extends PokemonCard {

  public tags = [CardTag.ANCIENT];
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Knock Down',
      cost: [R],
      damage: 30,
      text: ''
    },
    {
      name: 'Blazing Charge',
      cost: [R, R, C],
      damage: 100,
      damageCalculation: '+',
      text: 'If your opponent has 4 or fewer Prize cards remaining, this attack does 70 more damage. '
    }
  ];

  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Gouging Fire';
  public fullName: string = 'Gouging Fire SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentPrizes = opponent.getPrizeLeft();

      if (opponentPrizes <= 4) {
        effect.damage += 70;
      }
    }

    return state;
  }
}