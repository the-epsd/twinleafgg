import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, REMOVE_MARKER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Spheal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Willpower',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, during your next turn, Spheal\'s Rollout attack\'s base damage is 40.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Spheal';
  public fullName: string = 'Spheal MT';

  public readonly WILLPOWER_MARKER = 'WILLPOWER_MARKER';
  public readonly WILLPOWER_CLEAR_MARKER = 'WILLPOWER_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[1],
      boostedAttack: this.attacks[0],
      source: this,
      baseDamage: 40,
      bonusMarker: this.WILLPOWER_MARKER,
      clearMarker: this.WILLPOWER_CLEAR_MARKER,
    });

    // Willpower — coin flip gates the boost armed by NEXT_TURN_ATTACK_BASE_DAMAGE
    if (WAS_ATTACK_USED(effect, 1, this)) {
      REMOVE_MARKER(this.WILLPOWER_MARKER, effect.player, this);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_MARKER(this.WILLPOWER_MARKER, effect.player, this);
        }
      });
    }

    return state;
  }
}
