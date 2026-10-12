import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from '../../../game';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spinarak';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Big Net',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Evolution Pokémon\'s Retreat Cost is [C] more.'
  }];

  public attacks = [{
    name: 'String Bind',
    cost: [G],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const targetCard = retreatingPlayer.active.getPokemonCard();
      if (!targetCard || targetCard.stage === Stage.BASIC) {
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

      effect.cost.push(CardType.COLORLESS);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveCard = opponent.active.getPokemonCard();
      if (opponentActiveCard) {
        const retreatCost = opponentActiveCard.retreat.filter(c => c === CardType.COLORLESS).length;

        effect.damage += retreatCost * 30;
      }
      return state;
    }

    return state;
  }
}
