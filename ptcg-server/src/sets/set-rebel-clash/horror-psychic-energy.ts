import { StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HorrorPsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'RCL';

  public name = 'Horror Psychic Energy';

  public fullName = 'Horror Psychic Energy DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '172';

  public text =
    'As long as this card is attached to a Pokémon, it provides [P] Energy.' +
    '' +
    'If the [P] Pokémon this card is attached to is in the Active Spot and is damaged by an opponent\'s attack (even if it is Knocked Out), put 2 damage counters on the Attacking Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [CardType.PSYCHIC] });

      return state;
    }

    if (effect instanceof AfterDamageEffect && effect.target.cards?.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      const checkPokemonType = new CheckPokemonTypeEffect(targetPlayer.active);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.PSYCHIC)) {
        if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
          return state;
        }

        if (state.phase === GamePhase.ATTACK) {
          effect.source.damage += 20;
        }
      }
    }

    return state;
  }

}
