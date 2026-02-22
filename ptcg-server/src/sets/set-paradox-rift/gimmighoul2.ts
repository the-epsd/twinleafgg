import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gimmighoul2 extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Continuous Coin Toss',
      cost: [C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gimmighoul';
  public fullName: string = 'Gimmighoul2 PAR';

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
          effect.damage = 20 * heads;
          return state;
        });
      };
      return flipCoin();
    }
    return state;
  }
}