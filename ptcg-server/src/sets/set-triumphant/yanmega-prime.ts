import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Yanmega extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Yanma';
  public tags = [CardTag.PRIME];
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Insight',
    powerType: PowerType.POKEBODY,
    text: 'If you have the same number of cards in your hand as your opponent the attack cost of each of Yanmega\'s attacks is 0.',
  }];

  public attacks = [{
    name: 'Linear Attack',
    cost: [G, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Sonic Boom',
    cost: [G, G, C],
    damage: 70,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'TM';
  public setNumber: string = '98';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yanmega';
  public fullName: string = 'Yanmega TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && (effect.attack === this.attacks[0] || effect.attack === this.attacks[1])) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (player.hand.cards.length === opponent.hand.cards.length) {
        effect.cost = [];
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(40, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    return state;
  }

}