import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Porygon2 extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Porygon';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tri-Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      damageCalculator: 'x',
      text: 'Flip 3 coins. This attack does 30 damage for each heads.'
    }
  ];

  public regulationMark = 'E';

  public set: string = 'CRE';

  public name: string = 'Porygon2';

  public fullName: string = 'Porygon2 CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 30 * heads;
      });
    }
    return state;
  }
}