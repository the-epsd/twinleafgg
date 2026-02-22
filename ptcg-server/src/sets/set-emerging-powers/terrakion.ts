import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Boulder Crush',
      cost: [F, C],
      damage: 40,
      text: ''
    },
    {
      name: 'Sacred Sword',
      cost: [F, F, C],
      damage: 100,
      text: 'This Pokémon can\'t use Sacred Sword during your next turn.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion EPO';

  public readonly SACRED_SWORD_MARKER = 'TERRAKION_SACRED_SWORD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
