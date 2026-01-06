import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { State, StoreLike, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckSpecialConditionRemovalEffect } from '../../game/store/effects/check-effects';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Stench',
    powerType: PowerType.ABILITY,
    text: 'The Special Condition Poisoned is not removed when your opponent\'s Pokémon evolve or devolve.'
  }];

  public attacks = [{
    name: 'Toxic Secretion',
    cost: [P],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
  }];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Muk';
  public fullName: string = 'Muk TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckSpecialConditionRemovalEffect) {
      // Check if this Pokemon is in play
      const cardList = StateUtils.findCardList(state, this);
      if (!cardList) {
        return state;
      }

      const owner = StateUtils.findOwner(state, cardList);
      const isInPlay = owner.active.cards.includes(this) || owner.bench.some(b => b.cards.includes(this));

      if (!isInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);

      // Check if the target Pokemon belongs to the opponent
      const isOpponentPokemon = opponent.active === effect.target ||
        opponent.bench.includes(effect.target);

      if (isOpponentPokemon && effect.target.specialConditions.includes(SpecialCondition.POISONED)) {
        if (!effect.preservedConditions.includes(SpecialCondition.POISONED)) {
          effect.preservedConditions.push(SpecialCondition.POISONED);
        }
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this, 20);
    }

    return state;
  }
}