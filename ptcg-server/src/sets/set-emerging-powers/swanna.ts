import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Swanna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ducklett';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Wing Dance',
      cost: [C, C],
      damage: 30,
      text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Air Slash',
      cost: [W, C, C],
      damage: 70,
      text: 'Discard an Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Swanna';
  public fullName: string = 'Swanna EPO';

  public readonly WING_DANCE_MARKER = 'WING_DANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.active.marker.addMarker(this.WING_DANCE_MARKER, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    // Prevent damage and effects
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.WING_DANCE_MARKER, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const attacker = effect.player;
      if (player !== attacker) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.WING_DANCE_MARKER, this);
    }

    return state;
  }
}
