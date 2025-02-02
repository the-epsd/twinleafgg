import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Klang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Klink';
  public regulationMark: string = 'F';
  public cardType: CardType = CardType.METAL;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Gear Grind',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip 2 coins. The attack does 80 damage for each heads.'
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Klang';
  public fullName: string = 'Klang SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = 80 * heads;
      });

    }

    return state;
  }

}