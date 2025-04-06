import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Medicham extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Meditite';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Barrage',
    powerType: PowerType.ANCIENT_TRAIT,
    barrage: true,
    text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Calm Mind',
    cost: [C],
    damage: 0,
    text: 'Heal 30 damage from this Pokémon.'
  }, {
    name: 'Yoga Kick',
    cost: [F, F],
    damage: 30,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'PRC';
  public name: string = 'Medicham';
  public fullName: string = 'Medicham PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }
    return state;
  }
}