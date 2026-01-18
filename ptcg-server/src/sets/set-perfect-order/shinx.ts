import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Shinx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Scratch',
    cost: [L],
    damage: 0,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 10 damage for each heads.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let headsCount = 0;
      let flipsDone = 0;

      const flipCoins = (s: State): State => {
        if (flipsDone >= 2) {
          // All flips done, calculate damage
          effect.damage = headsCount * 10;
          return s;
        }

        const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
          flipsDone++;
          if (result) {
            headsCount++;
          }
          // Continue flipping until we've done 2 flips
          if (flipsDone < 2) {
            flipCoins(s);
          } else {
            // All flips done, calculate damage
            effect.damage = headsCount * 10;
          }
        });

        return store.reduceEffect(s, coinFlipEffect);
      };

      return flipCoins(state);
    }
    return state;
  }
}
