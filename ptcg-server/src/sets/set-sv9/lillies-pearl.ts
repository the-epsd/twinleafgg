import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import {ToolEffect} from '../../game/store/effects/play-card-effects';


export class LilliesPearl extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '93';

  public name: string = 'Lillie\'s Pearl';

  public fullName: string = 'Lillie\'s Pearl SV9';

  public text: string =
    'If the Lillie\'s Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card.';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (effect.target.isLillies()) {
        effect.prizeCount -= 1;
      }

      return state;
    }
    return state;
  }
}



