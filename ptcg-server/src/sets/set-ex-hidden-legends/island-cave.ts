import { State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class IslandCave extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public trainerType = TrainerType.STADIUM;
  public set = 'HL';
  public name = 'Island Cave';
  public fullName = 'Island Cave HL';

  public text = 'Whenever any player attaches an Energy card from his or hand to [W] Pokémon, [F] Pokémon, or [M] Pokémon, remove any Special Conditions from that Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && StateUtils.getStadiumCard(state) === this) {

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.WATER) ||
        checkPokemonTypeEffect.cardTypes.includes(CardType.FIGHTING) ||
        checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
        effect.target.removeSpecialCondition(SpecialCondition.ASLEEP);
        effect.target.removeSpecialCondition(SpecialCondition.PARALYZED);
        effect.target.removeSpecialCondition(SpecialCondition.CONFUSED);
        effect.target.removeSpecialCondition(SpecialCondition.BURNED);
        effect.target.removeSpecialCondition(SpecialCondition.POISONED);
      }
    }

    return state;
  }

}