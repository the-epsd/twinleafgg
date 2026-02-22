import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class Virizion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Giga Drain',
      cost: [G, C],
      damage: 30,
      text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
    },
    {
      name: 'Sacred Sword',
      cost: [G, G, C],
      damage: 100,
      text: 'This Pokémon can\'t use Sacred Sword during your next turn.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Virizion';
  public fullName: string = 'Virizion EPO';

  public readonly SACRED_SWORD_MARKER = 'SACRED_SWORD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // We need to heal after damage is dealt
      const afterDamage = new AfterDamageEffect(effect, effect.damage);
      state = store.reduceEffect(state, afterDamage);

      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect.damage, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.active.marker.hasMarker(this.SACRED_SWORD_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.active.marker.addMarker(this.SACRED_SWORD_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.removeMarker(this.SACRED_SWORD_MARKER, this);
    }

    return state;
  }
}
