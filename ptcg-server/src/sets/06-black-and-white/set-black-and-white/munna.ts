import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike } from '../../../game';
export class Munna extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hypnosis',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Dream Eater',
    cost: [P, P],
    damage: 60,
    text: 'If the Defending Pokémon is not Asleep, this attack does nothing.'
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Munna';
  public fullName: string = 'Munna BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-base-set/haunter.ts (Hypnosis)
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Ref: set-black-and-white/musharna.ts (Dream Eater)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (!effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        effect.damage = 0;
      }
    }

    return state;
  }
}
