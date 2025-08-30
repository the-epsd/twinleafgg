import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Poochyena extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Continuous Steps',
    cost: [D],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 10 damage for each heads.'
  },
  {
    name: 'Darkness Fang',
    cost: [D, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Poochyena';
  public fullName: string = 'Poochyena TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

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
            effect.damage = 10 * headsCount;
          }
        });
        store.reduceEffect(state, coinFlipEffect);
      };

      flipUntilTails();
    }
    return state;
  }
}