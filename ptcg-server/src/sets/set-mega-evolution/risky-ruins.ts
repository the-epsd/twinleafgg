import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect, PlayPokemonFromDeckEffect } from '../../game/store/effects/play-card-effects';

export class DangerousRuins extends TrainerCard {
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public trainerType = TrainerType.STADIUM;
  public set = 'MEG';
  public name = 'Risky Ruins';
  public fullName = 'Risky Ruins MEG';
  public text = 'Whenever either player puts a non-[D] Basic Pokémon onto their Bench, put 2 damage counters on that Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof PlayPokemonEffect || effect instanceof PlayPokemonFromDeckEffect) && StateUtils.getStadiumCard(state) === this) {
      if (effect.target.cards.length > 0 || effect.pokemonCard.cardType === CardType.DARK) {
        return state;
      }

      if (effect.pokemonCard.stage === Stage.BASIC) {
        effect.target.damage += 20;
      }
      return state;
    }

    return state;
  }

}