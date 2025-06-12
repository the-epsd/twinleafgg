import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class PowerProtein extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'M1L';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public regulationMark = 'I';
  public name: string = 'Power Protein';
  public fullName: string = 'Power Protein M1L';

  public text: string =
    'During this turn, your [F] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public readonly POWER_PROTEIN_MARKER = 'POWER_PROTEIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.POWER_PROTEIN_MARKER, this);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (effect instanceof DealDamageEffect && effect.player.active.getPokemonCard()?.cardType === CardType.FIGHTING) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.marker.hasMarker(this.POWER_PROTEIN_MARKER, this) && effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 30;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.POWER_PROTEIN_MARKER, this);
    }

    return state;
  }

}
