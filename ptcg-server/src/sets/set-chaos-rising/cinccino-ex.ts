import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { GamePhase } from '../../game/store/state/state';
import { PokemonCard, StateUtils, StoreLike, State } from '../../game';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cinccinoex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Minccino';
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 240;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];
  public powers = [{
    name: 'Smooth Coat',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokemon by attacks, flip a coin. If heads, prevent that damage.'
  }];
  public attacks = [{
    name: 'Energized Slap',
    cost: [C],
    damage: 0,
    damageCalculation: 'x' as 'x',
    text: 'This attack does 40 damage for each Energy attached to this Pokemon.'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Cinccino ex';
  public fullName: string = 'Cinccino ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if ((effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);
      if (state.phase !== GamePhase.ATTACK) return state;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          if (effect instanceof PutDamageEffect) {
            effect.preventDefault = true;
          } else {
            (effect as DealDamageEffect).damage = 0;
          }
        }
      });
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const energyCount = effect.source?.cards.filter((c: any) => c instanceof EnergyCard).length ?? 0;
      effect.damage = 40 * energyCount;
    }
    return state;
  }
}
