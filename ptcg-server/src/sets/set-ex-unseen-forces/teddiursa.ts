import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Teddiursa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Teary Eyes',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, any damage done to Teddiursa by attacks is reduced by 20 (after applying Weakness and Resistance).'
    },
    {
      name: 'Scratch',
      cost: [C],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'UF';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Teddiursa';
  public fullName: string = 'Teddiursa UF';

  public readonly TEARY_EYES_MARKER = 'TEARY_EYES_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      opponent.marker.addMarker(this.TEARY_EYES_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.player.marker.hasMarker(this.TEARY_EYES_MARKER, this)) {
      if (effect.target.getPokemonCard() === this) { effect.damage -= 20; }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TEARY_EYES_MARKER, this)) {
      effect.player.marker.removeMarker(this.TEARY_EYES_MARKER, this);
    }

    return state;
  }
}
