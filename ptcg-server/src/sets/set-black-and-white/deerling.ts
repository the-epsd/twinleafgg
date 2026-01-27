import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Deerling extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Double Kick',
      cost: [C],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Leech Seed',
      cost: [G, C],
      damage: 20,
      text: 'Heal 10 damage from this Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Deerling';
  public fullName: string = 'Deerling BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 10 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(10, effect, store, state);
    }

    return state;
  }
}
