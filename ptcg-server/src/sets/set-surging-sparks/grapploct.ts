import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Grapploct extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Clobbopus';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Chop',
      cost: [F],
      damage: 40,
      text: ''
    },
    {
      name: 'Raging Tentacles',
      cost: [F, F, C],
      damage: 130,
      text: 'If this Pokémon has any damage counters on it, this attack can be used for [F].'
    }
  ];

  public set: string = 'SSP';
  public setNumber = '113';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Grapploct';
  public fullName: string = 'Grapploct SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Raging Tentacles
    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (effect.player !== player || player.active.getPokemonCard() !== this) {
        return state;
      }

      if (effect.player.active.damage > 0) {
        effect.cost = [F];
      }

      return state;
    }

    return state;
  }
} 