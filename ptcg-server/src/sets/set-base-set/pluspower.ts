import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class PlusPower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '84';

  public name: string = 'PlusPower';

  public fullName: string = 'PlusPower BS';

  public text: string =
    'Attach PlusPower to your Active Pokémon. At the end of your turn, discard PlusPower. If this Pokémon\'s attack does damage to the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage to the Defending Pokémon.';

  private readonly PLUS_POWER_MARKER = 'PLUS_POWER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.PLUS_POWER_MARKER, this);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.PLUS_POWER_MARKER, this) && effect.damage > 0) {
        effect.damage += 10;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PLUS_POWER_MARKER, this);
    }

    return state;
  }

}
