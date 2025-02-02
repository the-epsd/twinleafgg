import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class IonosWattrel extends PokemonCard {

  public tags = [CardTag.IONOS];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 60;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [L],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Iono\'s Wattrel';

  public fullName: string = 'Iono\'s Wattrel SV9';

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