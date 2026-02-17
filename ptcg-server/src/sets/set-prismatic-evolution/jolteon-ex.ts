import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON } from '../../game/store/prefabs/costs';


export class Jolteonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = L;
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Flashing Spear',
    cost: [L, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may discard up to 2 Basic Energy from your Benched Pokémon. This attack does 90 more damage for each card discarded this way.'
  },
  {
    name: 'Dravite',
    cost: [R, W, L],
    damage: 280,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Jolteon ex';
  public fullName: string = 'Jolteon ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = 60;

      // Legacy implementation:
      // - Checked for any Benched Pokémon before prompting.
      // - Used DiscardEnergyPrompt restricted to BENCH + Basic Energy.
      // - Moved each selected Energy to discard manually.
      // - Set damage to 60 + 90 * discardedCount.
      //
      // Converted to prefab version (DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON).
      return DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(
        store,
        state,
        effect,
        2,
        { energyType: EnergyType.BASIC },
        0,
        [SlotType.BENCH],
        transfers => {
          effect.damage = 60 + (transfers.length * 90);
        }
      );
    }

    // Carnelian
    // Rampage Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(player);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}
