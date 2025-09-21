import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class Jigglypuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Ball Roll',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
  }];

  public regulationMark = 'I';
  public set: string = 'M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Jigglypuff';
  public fullName: string = 'Jigglypuff M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (WAS_ATTACK_USED(effect, 0, this)) {
        const player = effect.player;
        let headsCount = 0;

        const flipUntilTails = () => {
          const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
            if (result) {
              // Heads - increment count and flip again
              headsCount++;
              flipUntilTails();
            } else {
              // Tails - calculate final damage
              effect.damage = 20 * headsCount;
            }
          });
          store.reduceEffect(state, coinFlipEffect);
        };

        flipUntilTails();
      }
      return state;
    }
    return state;
  }
}