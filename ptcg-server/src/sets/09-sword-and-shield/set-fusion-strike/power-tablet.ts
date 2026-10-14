import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PowerTablet extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '236';
  public name: string = 'Power Tablet';
  public fullName: string = 'Power Tablet FST';
  public text: string =
    "During this turn, your Fusion Strike Pokémon's attacks do 30 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).";
  protected _tags = [CardTag.FUSION_STRIKE];
  public readonly POWER_TABLET_MARKER = 'POWER_TABLET_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      player.marker.addMarker(this.POWER_TABLET_MARKER, this);
    }

    if (
      effect instanceof DealDamageEffect &&
      effect.player.active.getPokemonCard()?.hasTag(CardTag.FUSION_STRIKE)
    ) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (
        player.marker.hasMarker(this.POWER_TABLET_MARKER, this) &&
        effect.damage > 0 &&
        effect.target === opponent.active
      ) {
        effect.damage += 30;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.POWER_TABLET_MARKER, this);
    }

    return state;
  }
}
