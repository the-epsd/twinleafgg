import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Luxio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shinx';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Jump On',
      cost: [L],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    },
    {
      name: 'Wild Charge',
      cost: [L, C, C],
      damage: 60,
      text: 'This Pokémon does 10 damage to itself.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luxio';
  public fullName: string = 'Luxio NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jump On
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
        }
      });
    }

    // Wild Charge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}
