import { State, StateUtils, StoreLike } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MagneticStorm extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public trainerType = TrainerType.STADIUM;
  public set = 'HL';
  public name = 'Magnetic Storm';
  public fullName = 'Magnetic Storm HL';

  public text = 'Any damage done by attacks from [P] Pokémon and [F] Pokémon (both yours and your opponent\'s) is not affected by Resistance.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && StateUtils.getStadiumCard(state) === this) {

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.PSYCHIC) || checkPokemonTypeEffect.cardTypes.includes(CardType.FIGHTING)) {
        effect.ignoreResistance = true;
      }
    }

    return state;
  }

}