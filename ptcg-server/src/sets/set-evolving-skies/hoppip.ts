import { CoinFlipPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hoppip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];

  public attacks = [{
    name: 'Continuous Spin',
    cost: [G],
    damage: 10,
    damageCalculationn: 'x',
    text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hoppip';
  public fullName: string = 'Hoppip EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          effect.damage = 10 * heads;
          return state;
        });
      };
      return flipCoin();
    }
    return state;
  }
}