import { StateUtils } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HolonEnergyFF extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name = 'Holon Energy FF';
  public fullName = 'Holon Energy FF DS';

  public text =
    'Holon Energy FF provides [C] Energy.' +
    '\n\n' +
    'If the Pokémon that Holon Energy FF is attached to also has a basic [R] Energy card attached to it, that Pokémon has no Weakness. If the Pokémon that Holon Energy FF is attached to also has a basic [F] Energy card attached to it, damage done by that Pokémon\'s attack isn\'t affected by Resistance. Ignore these effects if Holon Energy FF is attached to Pokémon-ex.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect
      && effect.target
      && effect.target.cards.includes(this)
      && !effect.target.tags.includes(CardTag.POKEMON_ex)
      && !IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.opponent, this, effect.target)) {

      console.log('Holon Energy FF effect');
      if (effect.target.energies.cards.some((card: any) => card.energyType === EnergyType.BASIC && card.name === 'Fire Energy')) {
        console.log('Holon Energy FF effect & fire energy detected');
        effect.ignoreWeakness = true;
      }
    }

    if (effect instanceof AttackEffect
      && effect.source
      && effect.source.cards.includes(this)
      && !effect.source.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)
      && !IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.source)) {

      if (effect.source.energies.cards.some((card: any) => card.energyType === EnergyType.BASIC && card.name === 'Fighting Energy')) {
        effect.ignoreResistance = true;
      }
    }

    if (effect instanceof CheckPokemonStatsEffect
      && effect.target.cards.includes(this)
      && effect.target.energies.cards.some((card: any) => card.energyType === EnergyType.BASIC && card.name === 'Fire Energy')) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, player);
      if (!IS_SPECIAL_ENERGY_BLOCKED(store, state, opponent, this, effect.target)) {
        const target = effect.target.getPokemonCard();
        if (target) {
          effect.weakness = [];
        }
      }
    }

    return state;
  }

}
