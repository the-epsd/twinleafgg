import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Scorbunny extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 70;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Quick Attack',
    cost: [CardType.COLORLESS],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 more damage.',
  }];

  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Scorbunny';
  public fullName: string = 'Scorbunny SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const coinFlipEffect = new CoinFlipEffect(effect.player, (result: boolean) => {
        if (result) {
          effect.damage += 10;
        }
      });
      return store.reduceEffect(state, coinFlipEffect);
    }
    return state;
  }
}
