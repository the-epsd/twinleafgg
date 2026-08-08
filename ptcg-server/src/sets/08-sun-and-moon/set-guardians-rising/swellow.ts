import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  REMOVE_MARKER_AT_END_OF_TURN,
  REPLACE_MARKER_AT_END_OF_TURN,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Swellow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Taillow';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Agility',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Swallow Dive',
    cost: [C],
    damage: 40,
    damageCalculation: '+',
    text: 'If this Pokémon used Agility during your last turn, this attack does 80 more damage.'
  }];

  public set: string = 'GRI';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swellow';
  public fullName: string = 'Swellow GRI';

  public readonly USED_AGILITY_MARKER = 'SWELLOW_GRI_USED_AGILITY';
  public readonly CLEAR_USED_AGILITY_MARKER = 'SWELLOW_GRI_CLEAR_USED_AGILITY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Agility
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });

      // Track Agility for Swallow Dive (2-phase: persists until end of next turn)
      effect.player.marker.addMarker(this.USED_AGILITY_MARKER, this);
    }

    // Swallow Dive
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.marker.hasMarker(this.CLEAR_USED_AGILITY_MARKER, this)) {
        effect.damage += 80;
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_USED_AGILITY_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.USED_AGILITY_MARKER, this.CLEAR_USED_AGILITY_MARKER, this);

    return state;
  }
}
