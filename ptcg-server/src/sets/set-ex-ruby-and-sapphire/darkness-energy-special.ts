import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';


export class DarknessEnergySpecial extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'RS';
  public name = 'Darkness Energy';
  public fullName = 'Darkness Energy RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';

  public text = 'If the Pokémon Darkness Energy is attached to attacks, the attack does 10 more damage to the Active Pokémon (before applying Weakness and Resistance). Ignore this effect unless the Attacking Pokémon is [D] or has Dark in its name. Darkness Energy provides [D] Energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect) {
      if (effect.source.cards.includes(this)) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        if (effect.target !== opponent.active) {
          return state;
        }

        const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.DARK) || effect.source.getPokemonCard()?.tags.includes(CardTag.DARK)) {
          effect.damage += 10;
        }
      }
    }

    return state;
  }

}
