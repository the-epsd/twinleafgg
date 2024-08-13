import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class MaximumBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '154';

  public regulationMark = 'H';

  public name: string = 'Maximum Belt';

  public fullName: string = 'Maximum Belt TEF';

  public text: string =
    'The attacks of the Pokémon this card is attached to do 50 more damage to your opponent\'s Active Pokémon ex.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.tags.includes(CardTag.POKEMON_ex) && effect.damage > 0) {
        effect.damage += 50;
      }
    }

    return state;
  }

}
