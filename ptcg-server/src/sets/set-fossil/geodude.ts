import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Geodude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 50;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Stone Barrage',
    cost: [F, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Geodude';
  public fullName: string = 'Geodude FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let damage = 0;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          damage++;
          return this.reduceEffect(store, state, effect);
        }
        effect.damage = damage;
      });
    }

    return state;
  }
}