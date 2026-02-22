import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Absol extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Dark Ambition',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Active Pokémon is a Basic Pokémon, its Retreat Cost is [C] more.'
  }];

  public attacks = [{
    name: 'Shadow Seeker',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost. '
  }];

  public set = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name = 'Absol';
  public fullName = 'Absol TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this) || !opponent.active.isStage(Stage.BASIC)) {
        return state;
      }

      effect.cost.push(CardType.COLORLESS);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveCard = opponent.active.getPokemonCard();
      if (opponentActiveCard) {
        const retreatCost = opponentActiveCard.retreat.filter(c => c === CardType.COLORLESS).length;

        effect.damage += retreatCost * 30;

        return state;
      }
    }

    return state;
  }
}