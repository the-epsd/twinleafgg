import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Klang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Klink';
  public cardType: CardType = M;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Metal Sound',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Guard Press',
      cost: [M, M, C],
      damage: 60,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Klang';
  public fullName: string = 'Klang EPO';

  public readonly GUARD_PRESS_MARKER = 'GUARD_PRESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.GUARD_PRESS_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.GUARD_PRESS_MARKER, this)) {
      effect.damage = Math.max(0, effect.damage - 20);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.GUARD_PRESS_MARKER, this);
    }

    return state;
  }
}
