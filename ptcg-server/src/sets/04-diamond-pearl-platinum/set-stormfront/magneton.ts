import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public hp: number = 80;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Magnetic Resonance',
    cost: [C, C],
    damage: 20,
    text: 'If you have a Stadium card in play, this attack does 20 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Magnetic Release',
    cost: [L, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 more damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magnetic Resonance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state, 2, 2, false, [SlotType.BENCH]);
    }

    // Magnetic Release
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage += energyCount * 10;
    }

    return state;
  }
}
