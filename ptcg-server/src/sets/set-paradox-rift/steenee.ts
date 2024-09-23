import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Steenee extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bounsweet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Spinning Attack',
      cost: [CardType.GRASS],
      damage: 30,
      text: ''
    },
    {
      name: 'Double Spin',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 40 damage for each heads.'
    }
  ];

  public set: string = 'PAR';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '9';

  public name: string = 'Steenee';

  public fullName: string = 'Steenee PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 40 * heads;
      });
    }
    return state;
  }
}