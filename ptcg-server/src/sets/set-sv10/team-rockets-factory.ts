import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import {PlaySupporterEffect} from '../../game/store/effects/play-card-effects';
import {CONFIRMATION_PROMPT, DRAW_CARDS} from '../../game/store/prefabs/prefabs';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class TeamRocketsFactory extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'SV10';
  public regulationMark = 'I';
  public name: string = 'Team Rocket\'s Factory';
  public fullName: string = 'Team Rocket\'s Factory SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public readonly FACTORY_MARKER = 'FACTORY_MARKER';

  public text: string = 'Once during either player\'s turn, when that player plays a Supporter with Team Rocket in its name from their hand, they may draw 2 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlaySupporterEffect && StateUtils.getStadiumCard(state) === this){
      
      if (effect.player.marker.hasMarker(this.FACTORY_MARKER, this) || !effect.trainerCard.tags.includes(CardTag.TEAM_ROCKET)){
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result){

          effect.player.marker.addMarker(this.FACTORY_MARKER, this);
          DRAW_CARDS(effect.player, 2);

        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.FACTORY_MARKER, this)){
      effect.player.marker.removeMarker(this.FACTORY_MARKER, this);
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
