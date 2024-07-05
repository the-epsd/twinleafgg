import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

export class Pikachu extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 2 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [CardType.LIGHTNING],
      damage: 10,
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    },
    {
      name: 'Electro Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BWP';
  public fullName: string = 'Pikachu BWP';
  public name: string = 'Pikachu';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          effect.damage += 10;
        }
      });
    }

    if (effect.attack === this.attacks[1]) {
      // No additional effects for Electro Ball
    }

    return state;
  }
}
