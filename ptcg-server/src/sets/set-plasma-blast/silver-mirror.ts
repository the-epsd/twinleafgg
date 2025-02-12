import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { PokemonCard } from '../../game';


export class SilverMirror extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'PLB';
  public name: string = 'Silver Mirror';
  public fullName: string = 'Silver Mirror PLB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';

  public text: string =
    'Prevent all effects of attacks, including damage, done to the Pokémon this card ' +
    'is attached to (excluding Pokémon-EX) by your opponent\'s Team Plasma Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.source.getPokemonCard() as PokemonCard;
      if (sourceCard.tags.includes(CardTag.TEAM_PLASMA)) {
        effect.preventDefault = true;
      }
    }

    return state;
  }

}
