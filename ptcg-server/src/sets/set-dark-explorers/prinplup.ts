import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Prinplup extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Piplup';

  public cardType: CardType = W;

  public hp: number = 80;

  public weakness = [{ type: L }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Razor Wing',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Fury Attack',
      cost: [W, C, C],
      damage: 30,
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Prinplup';

  public fullName: string = 'Prinplup DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '28';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 30 * heads;
      });
    }

    return state;
  }

}
