import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameError, GameMessage } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Cut Up',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Slashing Strike',
    cost: [C, C],
    damage: 60,
    text: 'During your next turn, this Pokémon can\'t use Slashing Strike.'
  }];

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public set: string = 'TEF';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther TEF';
  public setNumber: string = '1';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Slashing Strike
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      
      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    
    return state;
  }
}