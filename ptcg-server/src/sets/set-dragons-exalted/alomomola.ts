import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Alomomola extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Mysterious Beam',
      cost: [W, C],
      damage: 30,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
    },
    {
      name: 'Double Slap',
      cost: [W, C, C],
      damage: 50,
      damageCalculation: 'x' as 'x',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alomomola';
  public fullName: string = 'Alomomola DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Beam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    // Double Slap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 50 * heads;
      });
    }

    return state;
  }
}
