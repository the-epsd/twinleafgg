import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';

export class Masquerain extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Surskit';
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Centrifugal Force',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the number of Colorless Energy in the Defending Pokémon\'s Retreat Cost (after applying effects to the Retreat Cost).'
  },
{
    name: 'Swirling Ripple',
    cost: [G, G],
    damage: 30,
    damageCalculation: '+',
    text: 'If your opponent has any Water Pokémon in play, this attack does 30 damage plus 30 more damage and the Defending Pokémon is now Confused.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Masquerain';
  public fullName: string = 'Masquerain MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Centrifugal Force
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkRetreatCostEffect = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreatCostEffect);
      const retreatCost = checkRetreatCostEffect.cost.length;
      effect.damage = 20 * retreatCost;
    }

    // Swirling Ripple
    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
