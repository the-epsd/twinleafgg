import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class PowerTablet extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FST';

  public tags = [ CardTag.FUSION_STRIKE ];

  public set2: string = 'fusionstrike';

  public setNumber: string = '236';

  public regulationMark = 'E';

  public name: string = 'Power Tablet';

  public fullName: string = 'Power Tablet FST';

  public text: string =
    'During this turn, your Fusion Strike Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      if (pokemonCard && pokemonCard.tags.includes(CardTag.FUSION_STRIKE)) {
        effect.damage += 30;
      }
    }

    return state;
  }

}
