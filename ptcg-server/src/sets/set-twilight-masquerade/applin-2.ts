import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Applin2 extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tumbling Attack',
      cost: [CardType.GRASS],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public name: string = 'Applin';

  public fullName: string = 'Applin TWM 17';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }

}
