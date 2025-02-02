import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class ChoiceBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'GRI';

  public setNumber = '121';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Choice Band';

  public fullName: string = 'Choice Band GRI';

  public text: string =
    'The attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active Pokémon-GX or Active Pokémon-EX (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();
      if (effect.damage > 0 && effect.target === opponent.active && defending
        && (defending.tags.includes(CardTag.POKEMON_GX) || defending.tags.includes(CardTag.POKEMON_EX))) {
        effect.damage += 30;
      }
    }
    return state;
  }
}
