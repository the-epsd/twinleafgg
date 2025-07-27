import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gastly';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Hypnosis',
    cost: [],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Dream Eater',
    cost: [P, P],
    damage: 60,
    text: 'If the Defending Pokémon is not Asleep, this attack does nothing.'
  }];

  public set: string = 'DP';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (!effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        effect.damage = 0;
        return state;
      }
    }

    return state;
  }
} 