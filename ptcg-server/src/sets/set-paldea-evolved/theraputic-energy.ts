import { StoreLike, State, StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckTableStateEffect, CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class TheraputicEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '193';

  public regulationMark = 'G';

  public name = 'Theraputic Energy';

  public fullName = 'Theraputic Energy PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const pokemon = effect.source;
      if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
        state.players.forEach(player => {
          if (pokemon.specialConditions.length === 0) {
            return;
          }
  
          const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
          store.reduceEffect(state, checkPokemonTypeEffect);
  
          if (checkPokemonTypeEffect) {
            const conditions = pokemon.specialConditions.slice();
            conditions.forEach(condition => {
              pokemon.removeSpecialCondition(condition);
            });
          }
        });
        return state;
      }
  
      return state;
    }
    return state;
  }
}
  