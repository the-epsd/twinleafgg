import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt, GameMessage } from '../../game';

export class Duosion extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Solosis';

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Double Trick',
    cost: [CardType.PSYCHIC],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage for each heads.'
  }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Duosion';

  public fullName: string = 'Duosion TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 30 * heads;
      });
    }

    return state;
  }

}
