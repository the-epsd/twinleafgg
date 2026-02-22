import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { PreventRetreatEffect } from '../../game/store/effects/effect-of-attack-effects';

export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Leech Life',
      cost: [L],
      damage: 30,
      text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
    },
    {
      name: 'Electroweb',
      cost: [L, C, C],
      damage: 60,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Galvantula';
  public fullName: string = 'Galvantula BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leech Life - heal same amount as damage dealt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const healEffect = new HealTargetEffect(effect, effect.damage);
      healEffect.target = effect.player.active;
      store.reduceEffect(state, healEffect);
    }

    // Electroweb - prevent retreat
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const preventRetreat = new PreventRetreatEffect(effect);
      preventRetreat.markerSource = this;
      preventRetreat.applyEffect();
    }

    return state;
  }
}
