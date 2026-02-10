import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Blaziken extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Combusken';

  public cardType: CardType = R;

  public hp: number = 140;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Blaze Kick',
      cost: [R, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage. If tails, the Defending Pokémon is now Burned.'
    },
    {
      name: 'Flamethrower',
      cost: [R, R, C],
      damage: 130,
      text: 'Discard an Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '17';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Blaziken';

  public fullName: string = 'Blaziken DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blaze Kick attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          // Heads: +30 damage
          effect.damage += 30;
        } else {
          // Tails: Burn
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
      });
    }

    // Flamethrower attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
