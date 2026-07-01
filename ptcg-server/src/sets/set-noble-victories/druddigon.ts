import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED, BLOCK_RETREAT, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT } from '../../game/store/prefabs/prefabs';
export class Druddigon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public retreat = [C, C];

  public powers = [{
    name: 'Rough Skin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), put 2 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Clutch',
    cost: [C, C, C],
    damage: 60,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Druddigon';
  public fullName: string = 'Druddigon NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rough Skin - damage attacker when hit
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // Legacy implementation:
      // - Checked AfterDamageEffect, damage > 0, active-spot requirement, opponent source, and attack phase.
      // - Then placed 2 damage counters on the attacker.
      //
      // Converted to prefab version (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT).
      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      effect.source.damage += 20;
    }

    // Clutch - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    // Handle marker-based retreat blocking
    return state;
  }
}
