import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nidorino extends PokemonCard {
  public name = 'Nidorino';
  public set = 'BS';
  public setNumber: string = '37';
  public fullName = 'Nidorino BS';
  public cardImage: string = 'assets/cardback.png';

  public cardType: CardType = G;
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Nidoran ♂';
  public hp = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Double Kick',
      cost: [G, C, C],
      damage: 30,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.',
    },
    {
      name: 'Horn Drill',
      cost: [G, G, C, C],
      damage: 50,
      text: '',
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        ],
        (results) => {
          const heads = results.filter((r) => !!r).length;
          effect.damage = heads * 30;
        },
      );
    }
    return state;
  }
}
