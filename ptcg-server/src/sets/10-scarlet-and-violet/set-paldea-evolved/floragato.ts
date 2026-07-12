import { PokemonCard, Stage, CardType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { AFTER_ATTACK, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON } from '../../../game/store/prefabs/prefabs';

export class Floragato extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sprigatito';
  public cardType: CardType = G;
  public hp: number = 90;
  public retreat = [C];
  public weakness = [{ type: R }];

  public attacks = [{
    name: 'Seed Bomb',
    cost: [G],
    damage: 30,
    text: ''
  },
  {
    name: 'Magic Whip',
    cost: [C, C],
    damage: 50,
    text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public name: string = 'Floragato';
  public fullName: string = 'Floragato PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
      });
    }

    return state;
  }
}
