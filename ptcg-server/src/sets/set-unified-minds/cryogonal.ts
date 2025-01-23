import { CardType, GameError, GameMessage, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';

export class CryogonalUNM extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 90;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];
  public set = 'UNM';
  public setNumber = '46';
  public cardImage = 'assets/cardback.png';
  public name = 'Cryogonal';
  public fullName = 'Cryogonal UNM';
  public attacks = [
    {
      name: 'Frozen Lock',
      cost: [CardType.WATER],
      damage: 10,
      text: 'Your opponent can\'t play any Item cards from their hand during their next turn.'
    },
  ];

  private readonly FROZEN_LOCK_MARKER = 'FROZEN_LOCK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frozen Lock
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      opponent.marker.addMarker(this.FROZEN_LOCK_MARKER, this);
    }

    // Block item cards while we have the marker
    if (effect instanceof PlayItemEffect && effect.player.marker.hasMarker(this.FROZEN_LOCK_MARKER)) {
      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    // Remove marker at the end of a player's turn
    if (effect instanceof EndTurnEffect) { effect.player.marker.removeMarker(this.FROZEN_LOCK_MARKER); }
    return state;
  }
}