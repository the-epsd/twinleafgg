import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sunkern extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 40;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Bullet Seed',
      cost: [CardType.GRASS],
      damage: 10,
      damageCalculation: 'x',
      text: ' Flip 4 coins. This attack does 10 damage for each heads. '
    }];

  public set: string = 'TWM';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Sunkern TWM';
  public name: string = 'Sunkern';
  public setNumber: string = '6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
      return state;
    }

    return state;
  }
}