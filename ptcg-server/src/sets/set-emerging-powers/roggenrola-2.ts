import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Roggenrola2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Harden',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, if this Pokémon would be damaged by an attack, prevent that attack\'s damage done to this Pokémon if that damage is 40 or less.'
    },
    {
      name: 'Headbutt',
      cost: [F, C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Roggenrola';
  public fullName: string = 'Roggenrola EPO 49';

  public readonly HARDEN_MARKER = 'HARDEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.HARDEN_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.HARDEN_MARKER, this)) {
      if (effect.damage <= 40) {
        effect.damage = 0;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.HARDEN_MARKER, this);
    }

    return state;
  }
}
