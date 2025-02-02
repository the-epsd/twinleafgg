import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt, GameMessage } from '../../game';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Noibat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Agility',
    cost: [ C ],
    damage: 10,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokemon during your opponent\'s next turn.'
  }];

  public set: string = 'BUS';
  public name: string = 'Noibat';
  public fullName: string = 'Noibat BUS';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          if (effect instanceof PutDamageEffect) {
            effect.preventDefault = true;
          }
          if (effect instanceof AbstractAttackEffect) {
            effect.preventDefault = true;
          }
        }
      }
      );
    }
    return state;
  }
}