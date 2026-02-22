import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Piplup extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 60;

  public weakness = [{ type: L }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Fury Attack',
      cost: [W],
      damage: 10,
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Piplup';

  public fullName: string = 'Piplup DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
    }

    return state;
  }

}
