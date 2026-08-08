import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Brambleghast extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];
  public evolvesFrom: string = 'Bramblin';

  public powers = [{
    name: 'Resilient Soul',
    powerType: PowerType.ABILITY,
    text: ' This Pokémon gets +50 HP for each Prize card your opponent has taken. '
  }];

  public attacks = [{
    name: 'Powerful Needles',
    cost: [G, G, C],
    damage: 80,
    damageCalculation: 'x',
    text: ' Flip a coin for each Energy attached to this Pokémon. This attack does 80 damage for each heads. '
  }];

  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Brambleghast';
  public fullName: string = 'Brambleghast TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      const hpBoostPerPrize = 50;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.target.getPokemonCard() === this) {
        effect.hp += prizesTaken * hpBoostPerPrize;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.length;
      }, 0);

      if (totalEnergy > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, totalEnergy, results => {
          effect.damage = results.filter(r => r).length * 80;
        });
      } else {
        effect.damage = 0;
      }
    }

    return state;
  }
}