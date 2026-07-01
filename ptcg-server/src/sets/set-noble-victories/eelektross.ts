import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
export class Eelektross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Eelektrik';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Wild Charge',
      cost: [L, C, C],
      damage: 80,
      text: 'This Pokémon does 20 damage to itself.'
    },
    {
      name: 'Suction Drain',
      cost: [L, L, C, C],
      damage: 60,
      text: 'Heal 30 damage from this Pokémon. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eelektross';
  public fullName: string = 'Eelektross NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wild Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    // Suction Drain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
      BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}
