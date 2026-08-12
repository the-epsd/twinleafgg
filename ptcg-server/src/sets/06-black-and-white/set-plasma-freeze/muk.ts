import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  HEAL_X_DAMAGE_FROM_THIS_POKEMON,
} from '../../../game/store/prefabs/prefabs';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Muk extends PokemonCard {
  protected _tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Grimer';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Poison Suction',
    cost: [P, C, C],
    damage: 60,
    text: 'If the Defending Pokémon is Poisoned, heal 60 damage from this Pokémon.'
  }, {
    name: 'Sludge Crash',
    cost: [P, P, C, C],
    damage: 80,
    text: 'Flip a coin until you get tails. For each heads, discard an Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'PLF';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Muk';
  public fullName: string = 'Muk PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Suction
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 60);
      }
    }

    // Sludge Crash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, headsCount => {
        DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect, undefined, headsCount);
      });
    }

    return state;
  }
}
