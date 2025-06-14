import { PokemonCard, Stage, CardType, PowerType, StateUtils, CardTag } from '../../game';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class RocketsSuicuneex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.ROCKETS];
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Dark and Clear',
    powerType: PowerType.POKEBODY,
    text: 'As long as Rocket\'s Suicune ex has any [D] Energy attached to it, Rocket\'s Suicune ex can\'t be affected by any Special Conditions.'
  }];

  public attacks = [{
    name: 'Icy Wind',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Hyper Splash',
    cost: [W, W, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is a Stage 2 Evolved Pokémon, this attack does 50 damage plus 40 more damage.'
  }];

  public set: string = 'TRR';
  public name: string = 'Rocket\'s Suicune ex';
  public fullName: string = 'Rocket\'s Suicune ex TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Dark and Clear
    if (effect instanceof AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(effect.player, effect.target);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const energyMap = checkProvidedEnergyEffect.energyMap;
      const hasDarkEnergy = StateUtils.checkEnoughEnergy(energyMap, [CardType.DARK]);

      if (hasDarkEnergy) {
        effect.preventDefault = true;
      }
    }

    // Icy Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Hyper Splash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.isStage(Stage.STAGE_2) && effect.opponent.active.getPokemons.length > 1) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
