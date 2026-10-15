import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pidgeotto';
  public hp: number = 120;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Mirror Move',
    cost: [C, C],
    damage: 0,
    text: 'If Pidgeot was damaged by an attack during your opponent\'s last turn, this attack does the same amount of damage done to Pidgeot to the Defending Pokémon.'
  },
  {
    name: 'Whirlwind',
    cost: [C, C],
    damage: 50,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Pidgeot';
  public fullName: string = 'Pidgeot SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mirror Move
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = this.damageTakenLastTurn ?? 0;
    }

    // Whirlwind
    if (AFTER_ATTACK(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    return state;
  }
}
