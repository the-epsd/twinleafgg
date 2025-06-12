import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class PokeParksMunchlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Defense Curl',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon during your opponent\'s next turn.'
  },
  {
    name: 'Body Slam',
    cost: [C, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'PCGP';
  public name: string = 'PokéPark\'s Munchlax';
  public fullName: string = 'PokéPark\'s Munchlax PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';

  public readonly DEFENSE_CURL_MARKER = 'DEFENSE_CURL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.DEFENSE_CURL_MARKER, this);
          ADD_MARKER(this.DEFENSE_CURL_MARKER, effect.opponent, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && HAS_MARKER(this.DEFENSE_CURL_MARKER, effect.target, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.DEFENSE_CURL_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.DEFENSE_CURL_MARKER, effect.player, this);
      this.marker.removeMarker(this.DEFENSE_CURL_MARKER, this);
    }

    return state;
  }

}
