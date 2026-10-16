import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Poliwrath extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Poliwhirl';
  public hp: number = 130;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Focus Punch',
    cost: [F],
    damage: 60,
    text: 'If Poliwrath was damaged by an attack during your opponent\'s last turn, this attack does nothing.'
  },
  {
    name: 'Submission',
    cost: [F, C, C],
    damage: 90,
    text: 'Poliwrath does 20 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Poliwrath';
  public fullName: string = 'Poliwrath LA';

  public readonly FOCUS_PUNCH_MARKER = 'FOCUS_PUNCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.FOCUS_PUNCH_MARKER, this);

    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this
      && effect.damage > 0) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner.active === effect.target && effect.player !== owner) {
        ADD_MARKER(this.FOCUS_PUNCH_MARKER, owner, this);
      }
    }

    // Focus Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (HAS_MARKER(this.FOCUS_PUNCH_MARKER, effect.player, this)) {
        effect.damage = 0;
      }
    }

    // Submission
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    return state;
  }
}
