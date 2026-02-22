import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spinarak';
  public cardType: CardType = G;
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
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isAriadosInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isAriadosInPlay = true;
        }
      });

      if (!isAriadosInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const targetCard = player.active.getPokemonCard();

      if (targetCard && targetCard.stage !== Stage.BASIC) {
        effect.cost.push(CardType.COLORLESS);
        return state;
      }
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