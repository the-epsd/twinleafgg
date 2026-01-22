import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Vullaby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Rear Guard',
      cost: [D],
      damage: 0,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
    },
    {
      name: 'Gust',
      cost: [D, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Vullaby';
  public fullName: string = 'Vullaby EPO';

  public readonly REAR_GUARD_MARKER = 'REAR_GUARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.REAR_GUARD_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.REAR_GUARD_MARKER, this)) {
      effect.damage = Math.max(0, effect.damage - 30);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.REAR_GUARD_MARKER, this);
    }

    return state;
  }
}
