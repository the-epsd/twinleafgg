import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Scyther extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks =
    [
      {
        name: 'Swords Dance',
        cost: [CardType.GRASS],
        damage: 0,
        text: 'During your next turn, Scyther\'s Slash attack\'s base damage is 60 instead of 30.'
      },
      {
        name: 'Slash',
        cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        damage: 30,
        text: ''
      }
    ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '10';

  public name: string = 'Scyther';

  public fullName: string = 'Scyther JU';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
      effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
      effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
