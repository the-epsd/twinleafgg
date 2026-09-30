import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 120;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Life-Locked',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Pokémon can\'t be healed.'
  }];

  public attacks = [{
    name: 'Dark Cutter',
    cost: [D, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Life-Locked
    if (effect instanceof HealEffect) {
      for (const player of state.players) {
        if (!StateUtils.isPokemonInPlay(player, this)) {
          return state;
        }

        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return state;
        }

        const opponent = StateUtils.getOpponent(state, player);
        if (effect.target === opponent.active) {
          effect.preventDefault = true;
          return state;
        }
      }
    }

    return state;
  }
}
