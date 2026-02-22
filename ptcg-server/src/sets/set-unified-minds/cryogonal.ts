import { CardType, GameError, GameMessage, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cryogonal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Frozen Lock',
      cost: [W],
      damage: 10,
      text: 'Your opponent can\'t play any Item cards from their hand during their next turn.'
    },
  ];

  public set = 'UNM';
  public setNumber = '46';
  public cardImage = 'assets/cardback.png';
  public name = 'Cryogonal';
  public fullName = 'Cryogonal UNM';

  private readonly FROZEN_LOCK_MARKER = 'FROZEN_LOCK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frozen Lock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      opponent.marker.addMarker(this.FROZEN_LOCK_MARKER, this);
    }

    // Block item cards while we have the marker
    if (effect instanceof PlayItemEffect && effect.player.marker.hasMarker(this.FROZEN_LOCK_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    // Remove marker at the end of a player's turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.FROZEN_LOCK_MARKER)) {
      effect.player.marker.removeMarker(this.FROZEN_LOCK_MARKER);
    }
    return state;
  }
}