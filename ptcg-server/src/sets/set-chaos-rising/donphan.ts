import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Donphan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Phanpy';
  public hp: number = 150;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'No Reprieve',
    cost: [F],
    damage: 20,
    text: 'During your next turn, this Pokemon\'s attacks do 80 more damage to your opponent\'s Active Pokemon.'
  },
  {
    name: 'Smash Head',
    cost: [F, C, C, C],
    damage: 180,
    text: 'Discard 2 Energy attached to this Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Donphan';
  public fullName: string = 'Donphan M4';

  public readonly NO_REPRIEVE_MARKER = 'DONPHAN_M4_NO_REPRIEVE_MARKER';
  public readonly NO_REPRIEVE_CLEAR_MARKER = 'DONPHAN_M4_NO_REPRIEVE_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.NO_REPRIEVE_MARKER, effect.player, this);
    }
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.source);
      const opponent = StateUtils.getOpponent(state, player);
      if (effect.target === opponent.active && (HAS_MARKER(this.NO_REPRIEVE_MARKER, player, this) || HAS_MARKER(this.NO_REPRIEVE_CLEAR_MARKER, player, this))) {
        effect.damage += 80;
      }
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.NO_REPRIEVE_CLEAR_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.NO_REPRIEVE_MARKER, this.NO_REPRIEVE_CLEAR_MARKER, this);
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }
    return state;
  }
}
