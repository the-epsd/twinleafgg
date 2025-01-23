import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

// FLI Rockruff 75 (https://limitlesstcg.com/cards/FLI/75)
export class Rockruff extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Surprise Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'FLI';

  public setNumber = '75';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Rockruff';

  public fullName: string = 'Rockruff FLI';


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