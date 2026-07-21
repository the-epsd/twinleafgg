import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class HisuianBasculegion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C, C];
  public evolvesFrom = 'Hisuian Basculin';

  public attacks = [{
    name: 'Grudge Dive',
    cost: [W],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Jet Headbutt',
    cost: [W, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Hisuian Basculegion';
  public fullName: string = 'Hisuian Basculegion ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Grudge Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, { byAttackDamage: true })) {
        effect.damage += 90;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
        store.reduceEffect(state, specialConditionEffect);
      }
      return state;
    }

    return state;
  }
}