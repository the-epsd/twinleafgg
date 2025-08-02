import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Chinchou2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Float',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Chinchou.'
  },
  {
    name: 'Headbutt',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Chinchou';
  public fullName: string = 'Chinchou AQ 70';

  public readonly FLOAT_MARKER = 'FLOAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.FLOAT_MARKER, this);
          ADD_MARKER(this.FLOAT_MARKER, effect.opponent, this);
        }
      });
    }

    if (effect instanceof AbstractAttackEffect && effect.target.getPokemonCard() === this) {
      if (this.marker.hasMarker(this.FLOAT_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.FLOAT_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.FLOAT_MARKER, effect.player, this);
      this.marker.removeMarker(this.FLOAT_MARKER, this);
    }

    return state;
  }
}