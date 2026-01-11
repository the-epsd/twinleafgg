import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// CES Dhelmise 22 (https://limitlesstcg.com/cards/CES/22)
export class Dhelmise extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Giga Drain',
    cost: [G, C],
    damage: 30,
    text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Powerful Spin',
    cost: [G, G, C],
    damage: 130,
    text: 'This Pokémon can\'t attack during your next turn.'
  }];

  public set: string = 'CES';
  public setNumber: string = '22';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Dhelmise';
  public fullName: string = 'Dhelmise CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Giga Drain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, effect.damage);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    // Powerful Spin
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}