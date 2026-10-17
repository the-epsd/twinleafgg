import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hypnoblast',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Psychic',
    cost: [P, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 more damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Mewtwo';
  public fullName: string = 'Mewtwo LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hypnoblast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Psychic
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage += energyCount * 10;
    }

    return state;
  }
}
