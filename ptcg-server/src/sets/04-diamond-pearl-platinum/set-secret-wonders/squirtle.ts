import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Squirtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubble',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Aqua Tail',
    cost: [W, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin for each Water Energy attached to Squirtle. This attack does 20 damage plus 10 more damage for each heads.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Squirtle';
  public fullName: string = 'Squirtle SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Aqua Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(t =>
          t === CardType.WATER || t === CardType.ANY
        ).length;
      });
      if (energyCount > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
          effect.damage += results.filter(r => r).length * 10;
        });
      }
    }

    return state;
  }
}
