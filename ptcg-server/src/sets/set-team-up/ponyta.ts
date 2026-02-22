import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ponyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Live Coal',
      cost: [R],
      damage: 10,
      text: ''
    },
    {
      name: 'Stomp',
      cost: [R, R],
      damage: 10,
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public set: string = 'TEU';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ponyta';
  public fullName: string = 'Ponyta TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 30;
        }
      });
    }
    return state;
  }
}
