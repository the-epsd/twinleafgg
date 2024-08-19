import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class ChoiceBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '176';

  public regulationMark = 'G';

  public name: string = 'Choice Belt';

  public fullName: string = 'Choice Belt PAL';

  public text: string =
    'The attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active Pokémon V (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.tags.includes(CardTag.POKEMON_V) || targetCard && targetCard.tags.includes(CardTag.POKEMON_VMAX) || targetCard && targetCard.tags.includes(CardTag.POKEMON_VSTAR)) {
        effect.damage += 30;
      }
    }

    return state;
  }

}
