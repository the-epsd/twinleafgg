import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Druddigon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public retreat = [C, C];

  public powers = [{
    name: 'Rough Skin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is your Active Pokemon and is damaged by an opponent\'s attack (even if this Pokemon is Knocked Out), put 2 damage counters on the Attacking Pokemon.'
  }];

  public attacks = [{
    name: 'Clutch',
    cost: [C, C, C],
    damage: 60,
    text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Druddigon';
  public fullName: string = 'Druddigon NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rough Skin - damage attacker when hit
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // Only works if this is the active Pokemon and was damaged by opponent
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      // Only during attack phase
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Put 2 damage counters on attacker
      effect.source.damage += 20;
    }

    // Clutch - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    // Handle marker-based retreat blocking
    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}
