import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';

export class Riolu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Punch',
    cost: [ CardType.COLORLESS ],
    damage: 10,
    text: ''
  }, {
    name: 'Quick Attack',
    cost: [ CardType.FIGHTING, CardType.COLORLESS ],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'LTR';

  public name: string = 'Riolu';

  public fullName: string = 'Riolu LTR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
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
