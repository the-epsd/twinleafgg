import { StateUtils } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HolonEnergyWP extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name = 'Holon Energy WP';
  public fullName = 'Holon Energy WP DF';

  public text =
    'Holon Energy WP provides [C] Energy.' +
    '\n\n' +
    'If the Pokémon that Holon Energy WP is attached to also has a basic [W] Energy card attached to it, prevent all effects of attacks, excluding damage, done to that Pokémon by your opponent\'s Pokémon. If the Pokémon that Holon Energy WP is attached to also has a basic [P] Energy card attached to it, that Pokémon\'s Retreat Cost is 0. Ignore these effects if Holon Energy WP is attached to Pokémon-ex.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect
      && effect.target
      && effect.target.cards.includes(this)
      && !effect.target.tags.includes(CardTag.POKEMON_ex)
      && !IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.opponent, this, effect.target)) {

      if (effect.target.energies.cards.some((card: any) => card.energyType === EnergyType.BASIC && card.name === 'Water Energy')) {
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }
        effect.preventDefault = true;
      }
    }

    if (effect instanceof CheckRetreatCostEffect
      && effect.player.active.cards.includes(this)
      && !effect.player.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)
      && effect.player.active.energies.cards.some((card: any) => card.energyType === EnergyType.BASIC && card.name === 'Psychic Energy')) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (!IS_SPECIAL_ENERGY_BLOCKED(store, state, opponent, this, effect.player.active)) {
        effect.cost = [];
      }
    }

    return state;
  }

}
