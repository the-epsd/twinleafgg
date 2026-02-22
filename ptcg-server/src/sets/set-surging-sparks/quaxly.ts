import { PokemonCard, Stage, CardType, State, StoreLike, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Quaxly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Aerial Ace',
      cost: [W],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage. '
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quaxly';
  public fullName: string = 'Quaxly SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aerial Ace
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}