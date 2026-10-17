import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { RetreatEffect } from '../../../game/store/effects/game-effects';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StateUtils } from '../../../game/store/state-utils';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Dragalge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Skrelp';
  public cardType: CardType[] = [N];
  public hp: number = 100;
  public weakness = [{ type: Y }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Barrier',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Poisoned Pokemon can\'t retreat.'
  }];

  public attacks = [{
    name: 'Poison Breath',
    cost: [W, P, C],
    damage: 60,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon ' +
    'is now Poisoned.'
  }];

  public set: string = 'FLF';
  public name: string = 'Dragalge';
  public fullName: string = 'Dragalge FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(
            effect, [SpecialCondition.POISONED]
          );
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof RetreatEffect) {
      const retreatingPlayer = effect.player;

      if (!retreatingPlayer.active.specialConditions.includes(SpecialCondition.POISONED)) {
        return state;
      }

      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);
      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        retreatingPlayer.active,
      )) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    return state;
  }

}
