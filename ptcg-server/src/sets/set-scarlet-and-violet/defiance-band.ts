import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class DefianceBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public set2: string = 'scarletviolet';

  public setNumber: string = '169';

  public name: string = 'Defiance Band';

  public fullName: string = 'Defiance Band SVI';

  public text: string =
    'If you have more Prize cards remaining than your opponent, the attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  private readonly DEFIANCE_BAND_MARKER = 'DEFIANCE_BAND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        return state;
      }

      player.marker.addMarker(this.DEFIANCE_BAND_MARKER, this);
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.DEFIANCE_BAND_MARKER, this) && effect.damage > 0) {
        effect.damage += 30;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DEFIANCE_BAND_MARKER, this);
    }

    return state;
  }

}
