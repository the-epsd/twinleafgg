import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Gabite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gible';
  public cardType: CardType[] = [C];
  public hp: number = 80;
  public weakness = [{
    type: C,
    value: 20
  }];
  public retreat = [C];

  public attacks = [{
    name: 'Burrow',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Gabite by ' +
    'attacks during your opponent\'s next turn.'
  }, {
    name: 'Distorted Wave',
    cost: [C, C, C],
    damage: 60,
    text: 'Before doing damage, remove 2 damage counters from the Defending ' +
    'Pokemon.'
  }];

  public set: string = 'OP9';
  public name: string = 'Gabite';
  public fullName: string = 'Gabite OP9';

  public readonly CLEAR_BURROW_MARKER = 'CLEAR_DEFENSE_CURL_MARKER';
  public readonly BURROW_MARKER = 'DEFENSE_CURL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return COIN_FLIP_PROMPT(store, state, player, flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.BURROW_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_BURROW_MARKER, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const healTarget = new HealTargetEffect(effect, 20);
      return store.reduceEffect(state, healTarget);
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.BURROW_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_BURROW_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_BURROW_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.BURROW_MARKER, this);
      });
    }

    return state;
  }

}
