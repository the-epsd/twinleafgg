import { StateUtils, pokemonHasCardTypeOptional, Player } from '../../../game';
import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_MARKER, REMOVE_MARKER_AT_END_OF_TURN } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Electropower extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '172';
  public name: string = 'Electropower';
  public fullName: string = 'Electropower LOT';
  public text: string =
    "During this turn, your [L] Pokémon's attacks do 30 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).";

  public readonly ELECTROPOWER_MARKER = 'ELECTROPOWER_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      ADD_MARKER(this.ELECTROPOWER_MARKER, effect.player, this);
    }

    if (
      effect instanceof DealDamageEffect &&
      pokemonHasCardTypeOptional(effect.player.active.getPokemonCard(), CardType.LIGHTNING)
    ) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (
        player.marker.hasMarker(this.ELECTROPOWER_MARKER, this) &&
        effect.damage > 0 &&
        effect.target === opponent.active
      ) {
        effect.damage += 30;
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ELECTROPOWER_MARKER, this);

    return state;
  }
}
