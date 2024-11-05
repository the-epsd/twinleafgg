import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';

export class Froakie extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 70;

  public weakness = [{ type: L }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Try Bouncing',
      cost: [W],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Froakie';

  public fullName: string = 'Froakie OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}
