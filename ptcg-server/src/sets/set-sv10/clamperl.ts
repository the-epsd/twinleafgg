import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {DealDamageEffect} from '../../game/store/effects/attack-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class Clamperl extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Shell Press',
      cost: [W],
      damage: 10,
      text: 'During your opponent\'s next turn, this Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clamperl';
  public fullName: string = 'Clamperl SV10';

  public readonly SHELL_PRESS_MARKER = 'SHELL_PRESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shell Press
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      opponent.marker.addMarker(this.SHELL_PRESS_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.player.marker.hasMarker(this.SHELL_PRESS_MARKER, this)){
      if (effect.target.getPokemonCard() === this){ effect.damage -= 10; }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SHELL_PRESS_MARKER, this)){
      effect.player.marker.removeMarker(this.SHELL_PRESS_MARKER, this);
    }
    
    return state;
  }
}
