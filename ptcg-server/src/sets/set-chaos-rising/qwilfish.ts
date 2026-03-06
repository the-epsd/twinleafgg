import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PowerType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ADD_POISON_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';
import { GamePhase } from '../../game/store/state/state';

export class Qwilfish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Point',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is in the Active Spot and takes damage from an attack from your opponent\'s Pokemon, the Attacking Pokemon is now Poisoned.'
  }];

  public attacks = [{
    name: 'Venoshock',
    cost: [D],
    damage: 30,
    damageCalculation: '+' as '+',
    text: 'If your opponent\'s Active Pokemon is Poisoned, this attack does 50 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Qwilfish';
  public fullName: string = 'Qwilfish M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this && state.phase === GamePhase.ATTACK) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, targetOwner);

      if (IS_ABILITY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }

      if (effect.player === opponent && effect.damage > 0) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.damage += 50;
      }
    }
    return state;
  }
}
