import { GameError, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 130;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Cavern Tackle',
    cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
    damage: 120,
    text: 'During your opponent\'s next turn, prevent all damage from attacks done to this Pokémon. If 1 of your Pokémon used Cavern Tackle during your last turn, this attack can\'t be used. '
  }];

  public set: string = 'SIT';
  public setNumber: string = '97';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion SIT';

  public readonly CAVERN_TACKLE_MARKER = 'CAVERN_TACKLE_MARKER';

  private turnTracker = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CAVERN_TACKLE_MARKER, this)) {
      this.turnTracker++;

      // if 3 turns have passed, that means the attack was used, opponent couldn't damage
      // player couldn't use cavern tackle, so the attack is fully resolved
      if (this.turnTracker === 2) {
        effect.player.marker.removeMarker(this.CAVERN_TACKLE_MARKER, this);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check marker
      if (player.marker.hasMarker(this.CAVERN_TACKLE_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.marker.addMarker(this.CAVERN_TACKLE_MARKER, this);

      this.turnTracker = 0;
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.CAVERN_TACKLE_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }

    return state;
  }
}
