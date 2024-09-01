import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Chimchar extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark: string = 'H';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Firebreathing',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'TWM';

  public name: string = 'Chimchar';

  public fullName: string = 'Chimchar TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

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
