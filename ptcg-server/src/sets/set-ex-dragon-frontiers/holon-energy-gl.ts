import { PlayerType, StateUtils } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HolonEnergyGL extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name = 'Holon Energy GL';
  public fullName = 'Holon Energy GL DF';

  public text =
    'Holon Energy GL provides [C] Energy.' +
    '\n\n' +
    'If the Pokémon that Holon Energy GL is attached to also has a basic [G] Energy card attached to it, that Pokémon can\'t be affected by any Special Conditions. If the Pokémon that Holon Energy GL is attached to also has a basic[L] Energy card attached to it, damage done by your opponent\'s Pokémon-ex is reduced by 10. Ignore these effects if Holon Energy GL is attached to Pokémon-ex.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        const active = player.active;
        if (active.specialConditions.length === 0) {
          return;
        }

        if (active.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
          return;
        }

        if (active.cards.includes(this) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, active) && active.energies.cards.some((card: any) => card.energyType === EnergyType.BASIC && card.name === 'Grass Energy')) {
          const conditions = active.specialConditions.slice();
          conditions.forEach(condition => {
            active.removeSpecialCondition(condition);
          });
        }
      });
      return state;
    }

    if (effect instanceof PutDamageEffect && effect.source.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
      const damagedPlayer = StateUtils.findOwner(state, effect.target);
      let isEffectActive = false;

      damagedPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (isEffectActive || !cardList.cards.includes(this)) {
          return;
        }

        if (cardList.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
          return;
        }

        const hasBasicLightning = cardList.energies.cards.some((card: any) =>
          card.energyType === EnergyType.BASIC && card.name === 'Lightning Energy'
        );
        if (!hasBasicLightning) {
          return;
        }

        if (IS_SPECIAL_ENERGY_BLOCKED(store, state, damagedPlayer, this, cardList)) {
          return;
        }

        isEffectActive = true;
      });

      if (isEffectActive) {
        effect.damage -= 10;
      }
    }

    return state;
  }

}
