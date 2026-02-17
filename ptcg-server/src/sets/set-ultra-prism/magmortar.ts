import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GamePhase } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON } from '../../game/store/prefabs/costs';
import { SlotType } from '../../game';

export class Magmortar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magmar';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Incandescent Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.'
  }];

  public attacks = [
    {
      name: 'Fire Blaster',
      cost: [R, R, C],
      damage: 80,
      damageCalculation: '+' as '+',
      text: 'You may discard 2 Energy from this Pokémon. If you do, this attack does 80 more damage.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magmortar';
  public fullName: string = 'Magmortar UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Incandescent Body (passive - burn attacker when damaged)
    // Ref: set-sun-and-moon/poison-barb.ts (Poison Barb - AfterDamageEffect damage retaliation)
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);

      // Only trigger from opponent's attack
      if (player === opponent) {
        return state;
      }

      // Must be active
      if (player.active !== effect.target) {
        return state;
      }

      // Must have taken damage
      if (effect.damage <= 0) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        const burnEffect = new AddSpecialConditionsPowerEffect(opponent, this, effect.source, [SpecialCondition.BURNED]);
        store.reduceEffect(state, burnEffect);
      }
    }

    // Attack 1: Fire Blaster
    // Ref: set-temporal-forces/raging-bolt-ex.ts (Bellowing Thunder - DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(
        store,
        state,
        effect,
        2,
        {},
        0,
        [SlotType.ACTIVE],
        transfers => {
          if (transfers.length >= 2) {
            effect.damage += 80;
          }
        }
      );
    }

    return state;
  }
}
