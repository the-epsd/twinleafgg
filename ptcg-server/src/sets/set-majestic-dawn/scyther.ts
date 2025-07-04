import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Fury Cutter',
    cost: [G, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 damage plus 10 more damage. If 2 of them are heads, this attack does 10 damage plus 20 more damage. If all of them are heads, this attack does 10 damage plus 40 more damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, result => {
        const results = result.filter(r => r === true);
        let damageBonus = 0;
        if (results.length === 1) {
          damageBonus = 10;
        } else if (results.length === 2) {
          damageBonus = 20;
        } else if (results.length === 3) {
          damageBonus = 40;
        }
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damageBonus);
      });
    }

    return state;
  }
}