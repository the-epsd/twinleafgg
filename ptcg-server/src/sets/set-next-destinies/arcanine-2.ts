import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Arcanine2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Growlithe';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Blazing Mane',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.'
  }];

  public attacks = [{
    name: 'Fire Spin',
    cost: [R, R, C],
    damage: 100,
    text: 'Flip a coin. If tails, discard 2 Energy attached to this Pokémon.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arcanine';
  public fullName: string = 'Arcanine NXD 12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blazing Mane - burn attacker when hit
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // Only works if this is the active Pokémon and was damaged by opponent
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

      // Burn the attacking Pokémon
      player.active.addSpecialCondition(SpecialCondition.BURNED);
    }

    // Fire Spin - flip, if tails discard 2 energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
        }
      });
    }

    return state;
  }
}
