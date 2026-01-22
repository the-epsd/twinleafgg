import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

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
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
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
