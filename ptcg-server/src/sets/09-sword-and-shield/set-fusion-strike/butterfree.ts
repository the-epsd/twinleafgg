import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../../game';
import { SpecialCondition } from '../../../game/store/card/card-types';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED } from '../../../game/store/prefabs/prefabs';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metapod';
  public cardType: CardType[] = [G];
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers: Power[] = [
    {
      name: 'Tricolored Scales',
      powerType: PowerType.ABILITY,
      text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may make your opponent\'s Active Pokémon Burned, Confused, and Poisoned.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Gust',
      cost: [G, C],
      damage: 90,
      text: ''
    },
  ];

  public set: string = 'FST';
  public regulationMark = 'E';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Butterfree';
  public fullName: string = 'Butterfree FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      if (CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
          if (!CAN_APPLY_ABILITY_TO_TARGET(store, state, player, this.powers[0], this, opponent.active)) {
            return;
          }
          store.reduceEffect(
            state,
            new AddSpecialConditionsPowerEffect(
              player,
              this,
              opponent.active,
              [SpecialCondition.BURNED, SpecialCondition.CONFUSED, SpecialCondition.POISONED],
            ),
          );
        }
      })) {
        return state;
      }
    }

    return state;
  }
}