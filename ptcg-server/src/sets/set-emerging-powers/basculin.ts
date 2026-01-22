import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Basculin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Flail',
      cost: [C],
      damage: 10,
      damageCalculation: 'x',
      text: 'Does 10 damage times the number of damage counters on this Pokémon.'
    },
    {
      name: 'Final Gambit',
      cost: [W, C, C],
      damage: 80,
      text: 'Flip 2 coins. If both of them are tails, this Pokémon does 80 damage to itself.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Basculin';
  public fullName: string = 'Basculin EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const damageCounters = Math.floor(player.active.damage / 10);
      (effect as AttackEffect).damage = 10 * damageCounters;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const allTails = results.every(r => !r);
        if (allTails) {
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 80);
        }
      });
    }

    return state;
  }
}
