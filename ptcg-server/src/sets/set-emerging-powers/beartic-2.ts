import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Beartic2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cubchoo';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Sheer Cold',
      cost: [W, C, C],
      damage: 50,
      text: 'The Defending Pokémon can\'t attack during your opponent\'s next turn.'
    },
    {
      name: 'Icicle Crash',
      cost: [W, W, C, C],
      damage: 80,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Beartic';
  public fullName: string = 'Beartic EPO 30';

  public readonly SHEER_COLD_MARKER = 'SHEER_COLD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SHEER_COLD_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      (effect as AttackEffect).ignoreResistance = true;
    }

    // Block attack if marked
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.SHEER_COLD_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SHEER_COLD_MARKER, this);
    }

    return state;
  }
}
