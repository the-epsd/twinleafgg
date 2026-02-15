import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dragonair';
  public cardType: CardType = N;
  public hp: number = 150;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Hyper Beam',
      cost: [L, C, C],
      damage: 50,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pok\u00e9mon.'
    },
    {
      name: 'Hurricane Tail',
      cost: [G, C, C, C],
      damage: 60,
      damageCalculation: 'x' as const,
      text: 'Flip 4 coins. This attack does 60 damage times the number of heads.'
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hyper Beam - flip for energy discard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    // Hurricane Tail - flip 4, 60x heads
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 60 * heads;
      });
    }

    return state;
  }
}
