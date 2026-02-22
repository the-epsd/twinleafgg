/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Miraidonex extends PokemonCard {
  public tags = [CardTag.FUTURE, CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 220;
  public retreat = [C];

  public attacks = [{
    name: 'Repulsion Bolt',
    cost: [L, P],
    damage: 60,
    damageCalculator: '+',
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 100 more damage.'
  },
  {
    name: 'Cyber Drive',
    cost: [L, P, C],
    damage: 220,
    text: 'During your next turn, this Pokémon can\'t use Cyber Drive.'
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Miraidon ex';
  public fullName: string = 'Miraidon ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.damage > 0) {
        effect.damage += 100;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Legacy implementation:
      // - Pushed "Cyber Drive" into cannotUseAttacksNextTurnPending if missing.
      //
      // Converted to prefab version (THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN).
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(player, this.attacks[1]);
    }
    return state;
  }
}
