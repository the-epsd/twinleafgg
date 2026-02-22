import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NsKlinklang extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'N\'s Klang';
  public cardType: CardType = M;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [
    { name: 'Magnetic Blast', cost: [C], damage: 50, text: '' },
    {
      name: 'Triple Smash',
      cost: [M, M, C],
      damage: 120,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 120 damage for each heads.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'N\'s Klinklang';
  public fullName: string = 'N\'s Klinklang JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 120 * heads;
      });
    }
    return state;
  }

}