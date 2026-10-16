import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from '../../../game/store/prefabs/attack-effects';

export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cubone';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Heavy Bone',
    cost: [C],
    damage: 40,
    text: 'Flip a coin. If tails, Marowak can\'t use Heavy Bone during your next turn.'
  },
  {
    name: 'Bone Rush',
    cost: [F, F],
    damage: 50,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 50 damage times the number of heads.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Marowak';
  public fullName: string = 'Marowak LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heavy Bone
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.player.active.cannotUseAttacksNextTurnPending.push('Heavy Bone');
        }
      });
    }

    // Bone Rush
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 50);
    }

    return state;
  }
}
