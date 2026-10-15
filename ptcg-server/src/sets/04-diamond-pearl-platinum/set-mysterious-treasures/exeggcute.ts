import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Exeggcute extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Direct-hit Bomb',
    cost: [G],
    damage: 0,
    text: 'Flip a coin for each Energy attached to Exeggcute. Choose 1 of your opponent\'s Pokémon. For each heads, this attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Exeggcute';
  public fullName: string = 'Exeggcute MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Direct-hit Bomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);
      const energyCount = checkEnergy.energyMap.length;

      if (energyCount === 0) {
        return state;
      }

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
        const heads = results.filter(r => r).length;
        if (heads > 0) {
          THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10 * heads, effect, store, state);
        }
      });
    }

    return state;
  }
}
