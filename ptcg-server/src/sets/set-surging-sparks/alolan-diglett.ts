import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class AlolanDiglett extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Surprise Attack',
      cost: [],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'SSP';

  public setNumber = '122';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Alolan Diglett';

  public fullName: string = 'Alolan Diglett SSP';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Surprise Attack
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