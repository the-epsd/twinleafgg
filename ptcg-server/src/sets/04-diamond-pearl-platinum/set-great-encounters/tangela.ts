import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';

export class Tangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Vine Invite',
    cost: [C],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon.'
  },
{
    name: 'Grass Knot',
    cost: [G, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each Colorless Energy in the Defending Pokémon\'s Retreat Cost (after applying effects to the the Retreat Cost).'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Tangela';
  public fullName: string = 'Tangela GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vine Invite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      GUST_OPPONENT_BENCHED_POKEMON(store, state, player);
    }

    // Grass Knot
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive) {
      const checkRetreatCostEffect = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreatCostEffect);
      const retreatCost = checkRetreatCostEffect.cost.length;
      effect.damage += retreatCost * 10;
      }
    }

    return state;
  }
}
