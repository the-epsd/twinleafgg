import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Magnetic Bomb',
    cost: [L, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 damage plus 10 more damage. If tails, Magnemite does 10 damage to itself.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Magnemite';
  public fullName: string = 'Magnemite SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magnetic Bomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
      if (heads) {
      effect.damage += 10;
      } else {
      const selfDamage = new DealDamageEffect(effect, 10);
      selfDamage.target = effect.player.active;
      store.reduceEffect(state, selfDamage);
      }
      });
    }

    return state;
  }
}
