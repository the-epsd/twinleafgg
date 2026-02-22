import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pikachu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.DELTA_SPECIES];

  public cardType: CardType = M;

  public hp: number = 50;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Tail Whap',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Steel Headbutt',
      cost: [M, C, C],
      damage: 30,
      text: 'Flip a coin. If heads, this attack does 30 damage plus 10 more damage.'
    }
  ];

  public set: string = 'HP';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu HP';

  public setNumber: string = '79';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          effect.damage += 10;
        }
      });
    }
    return state;
  }
}
