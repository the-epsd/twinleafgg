import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';


export class BraveBangle extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'SV11W';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public regulationMark = 'I';
  public name: string = 'Brave Bangle';
  public fullName: string = 'Brave Bangle SV11W';

  public text: string = 'The attacks of the Pokémon this card is attached to (excluding Pokémon with a Rule Box) deal 30 more damage to your opponent\'s Active Pokémon ex.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.source.tools.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }
      const sourceCard = effect.source;
      const targetCard = effect.target.getPokemonCard();
      const attack = effect.attack;
      if (sourceCard && !sourceCard.hasRuleBox()) {
        if (targetCard && targetCard.tags.includes(CardTag.POKEMON_ex)) {
          if (attack && attack.damage > 0 && effect.target === opponent.active) {
            effect.damage += 30;
          }
        }
      }
      return state;
    }
    return state;
  }
}