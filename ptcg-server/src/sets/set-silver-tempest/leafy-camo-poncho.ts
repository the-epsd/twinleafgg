import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';

export class LeafyCamoPoncho extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public name: string = 'Leafy Camo Poncho';
  public fullName: string = 'Leafy Camo Poncho SIT';
  public set: string = 'SIT';
  public setNumber: string = '160';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // If this is a supporter effect from the opponent
    if (
      effect instanceof TrainerTargetEffect &&
      effect.trainerCard?.trainerType === TrainerType.SUPPORTER &&
      effect.target &&
      effect.target.cards.includes(this) &&
      (effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_VSTAR) || effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_VMAX))
    ) {
      effect.target = undefined;
    }
    return state;
  }
}