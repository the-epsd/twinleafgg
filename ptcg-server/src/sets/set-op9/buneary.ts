import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Buneary extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{
    type: F,
    value: 10
  }];
  public retreat = [C];

  public attacks = [{
    name: 'Dizzy Punch',
    cost: [C],
    damage: 10,
    text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
  }, {
    name: 'Defense Curl',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Buneary by ' +
    'attacks during your opponent\'s next turn.'
  }];

  public set: string = 'OP9';
  public name: string = 'Buneary';
  public fullName: string = 'Buneary OP9';

  public readonly CLEAR_DEFENSE_CURL_MARKER = 'CLEAR_DEFENSE_CURL_MARKER';
  public readonly DEFENSE_CURL_MARKER = 'DEFENSE_CURL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return COIN_FLIP_PROMPT(store, state, player, flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.DEFENSE_CURL_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_DEFENSE_CURL_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.DEFENSE_CURL_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_DEFENSE_CURL_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_DEFENSE_CURL_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DEFENSE_CURL_MARKER, this);
      });
    }

    return state;
  }

}
