import { PokemonCardList, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';

export class TherapeuticEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '193';

  public regulationMark = 'G';

  public name = 'Therapeutic Energy';

  public fullName = 'Therapeutic Energy PAL';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '' +
    'The Pokémon this card is attached to recovers from being Asleep, Confused, or Paralyzed and can\'t be affected by those Special Conditions.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const pokemon = effect.target;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      pokemon.removeSpecialCondition(SpecialCondition.ASLEEP);
      pokemon.removeSpecialCondition(SpecialCondition.PARALYZED);
      pokemon.removeSpecialCondition(SpecialCondition.CONFUSED);
    }

    if (effect instanceof CheckTableStateEffect) {
      const player = state.players[state.activePlayer];
      const cardList = StateUtils.findCardList(state, this);

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (cardList instanceof PokemonCardList && cardList.cards.includes(this)) {
        const conditionsToKeep = [SpecialCondition.ABILITY_USED, SpecialCondition.POISONED, SpecialCondition.BURNED];
        const hasSpecialCondition = cardList.specialConditions.some(condition => !conditionsToKeep.includes(condition));
        if (hasSpecialCondition) {
          cardList.specialConditions = cardList.specialConditions.filter(condition => conditionsToKeep.includes(condition));
        }
      }
    }
    return state;
  }
}