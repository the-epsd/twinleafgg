import { PokemonCardList, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class AromaticGrassEnergy extends EnergyCard {
  public provides: CardType[] = [C];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public regulationMark = 'D';
  public name = 'Aromatic Grass Energy';
  public fullName = 'Aromatic Grass Energy VIV';

  public text = `As long as this card is attached to a Pokémon, it provides[G] Energy.
    
The [G] Pokémon this card is attached to recovers from all Special Conditions and can't be affected by any Special Conditions.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.GRASS] });
      return state;
    }

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const pokemon = effect.target;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, pokemon)) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(pokemon);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      pokemon.removeSpecialCondition(SpecialCondition.ASLEEP);
      pokemon.removeSpecialCondition(SpecialCondition.PARALYZED);
      pokemon.removeSpecialCondition(SpecialCondition.CONFUSED);
      pokemon.removeSpecialCondition(SpecialCondition.BURNED);
      pokemon.removeSpecialCondition(SpecialCondition.POISONED);
      return state;
    }

    const cardList = StateUtils.findCardList(state, this);
    if (effect instanceof CheckTableStateEffect &&
      cardList instanceof PokemonCardList &&
      cardList.cards.includes(this)) {

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, cardList)) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(cardList);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      cardList.removeSpecialCondition(SpecialCondition.ASLEEP);
      cardList.removeSpecialCondition(SpecialCondition.PARALYZED);
      cardList.removeSpecialCondition(SpecialCondition.CONFUSED);
      cardList.removeSpecialCondition(SpecialCondition.BURNED);
      cardList.removeSpecialCondition(SpecialCondition.POISONED);
    }

    return state;
  }
}