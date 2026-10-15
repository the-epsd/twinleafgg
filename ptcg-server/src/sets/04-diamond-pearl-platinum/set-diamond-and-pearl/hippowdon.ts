import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT, DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { AttackEffect } from '../../../game/store/effects/game-effects';

export class Hippowdon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hippopotas';
  public hp: number = 110;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: 20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Vacuum Up',
    cost: [F, C, C],
    damage: 40,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Sand Eject',
    cost: [F, F, C, C],
    damage: 60,
    text: 'During your next turn, if an attack does damage to the Defending Pokémon (after applying Weakness and Resistance), that attack does 40 more damage.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Hippowdon';
  public fullName: string = 'Hippowdon DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vacuum Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Sand Eject
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(
        store,
        state,
        effect as AttackEffect,
        this,
        40,
      );
    }

    return state;
  }
}
