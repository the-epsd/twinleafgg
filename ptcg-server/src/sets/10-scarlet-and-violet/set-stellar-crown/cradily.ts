import {
  PokemonCard,
  Stage,
  CardType,
  PowerType,
  StoreLike,
  State,
  StateUtils,
  SpecialCondition,
  GameError,
  GameMessage,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CHOOSE_SPECIAL_CONDITION_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  WAS_POWER_USED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  COIN_FLIP_PROMPT,
  WAS_ATTACK_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
  IS_ABILITY_BLOCKED,
} from '../../../game/store/prefabs/prefabs';

export class Cradily extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lileep';
  public hp: number = 150;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Selective Slime',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may flip a coin. If heads, choose Burned, Confused, or Poisoned. Your opponent\'s Active Pokémon is now affected by that Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Miasma Wind',
    cost: [G],
    damage: 100,
    damageCalculation: 'x',
    text: 'This attack does 100 damage for each Special Condition affecting your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Cradily';
  public fullName: string = 'Cradily SCR';

  public readonly SELECTIVE_SLIME_MARKER = 'CRADILY_SELECTIVE_SLIME_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Selective Slime
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.SELECTIVE_SLIME_MARKER, this);
      ABILITY_USED(player, this);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          CHOOSE_SPECIAL_CONDITION_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.BURNED, SpecialCondition.CONFUSED, SpecialCondition.POISONED],
          );
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SELECTIVE_SLIME_MARKER, this);

    // Miasma Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      effect.damage = 100 * opponent.active.specialConditions.length;
    }

    return state;
  }
}
