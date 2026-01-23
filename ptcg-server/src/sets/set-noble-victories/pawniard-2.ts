import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class Pawniard2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Iron Head',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard NVI 75';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let headsCount = 0;

      const flipUntilTails = (s: State): State => {
        const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
          if (result) {
            headsCount++;
            flipUntilTails(s);
          } else {
            effect.damage = 10 * headsCount;
          }
        });
        return store.reduceEffect(s, coinFlipEffect);
      };

      return flipUntilTails(state);
    }
    return state;
  }
}
