import { GameError, GameMessage, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Cavern Tackle',
    cost: [F, F, C],
    damage: 120,
    text: 'During your opponent\'s next turn, prevent all damage from attacks done to this Pokémon. If 1 of your Pokémon used Cavern Tackle during your last turn, this attack can\'t be used.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public setNumber: string = '97';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion SIT';

  public readonly CAVERN_TACKLE_MARKER = 'CAVERN_TACKLE_MARKER';
  private turnTracker = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CAVERN_TACKLE_MARKER, this)) {
      this.turnTracker++;
      if (this.turnTracker === 2) {
        effect.player.marker.removeMarker(this.CAVERN_TACKLE_MARKER, this);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.CAVERN_TACKLE_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.marker.addMarker(this.CAVERN_TACKLE_MARKER, this);
      this.turnTracker = 0;
      PREVENT_DAMAGE(store, state, effect, this);
    }

    return state;
  }
}
