import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { DealDamageEffect } from "../../../game/store/effects/attack-effects";
import { CheckRetreatCostEffect, CheckAttackCostEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_ATTACKS_COST_MORE, DEFENDING_POKEMON_RETREAT_COSTS_MORE } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Rillaboom extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Thwackey';
  public cardType: CardType[] = [G];
  public hp: number = 180;
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Drum Beating',
    cost: [G],
    damage: 60,
    text: "During your opponent's next turn, attacks used by the Defending Pokémon cost [C] more, and its Retreat Cost is [C] more.",
  },
  {
    name: 'Wood Hammer',
    cost: [G, G],
    damage: 180,
    text: 'This Pokémon also does 50 damage to itself.',
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Rillaboom';
  public fullName: string = 'Rillaboom TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drum Beating
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_ATTACKS_COST_MORE(store, state, effect, 1);
      state = DEFENDING_POKEMON_RETREAT_COSTS_MORE(store, state, effect, 1);
      return state;
    }
    // Wood Hammer
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.attackCostIncreaseNextTurn > 0) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index > -1) {
          effect.cost.splice(index, 0, CardType.COLORLESS);
        } else {
          effect.cost.push(CardType.COLORLESS);
        }
      }
    }

    if (effect instanceof CheckAttackCostEffect && effect.player.active.retreatCostIncreaseNextTurn > 0) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index > -1) {
          effect.cost.splice(index, 0, CardType.COLORLESS);
        } else {
          effect.cost.push(CardType.COLORLESS);
        }
      }
    }

    return state;
  }
}
