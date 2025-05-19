import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';

export class Goomy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 40;
  public weakness = [{ type: Y }];
  public retreat = [C];

  public powers = [{
    name: 'Sticky Membrane',
    text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon\'s attacks cost [C] more.',
    powerType: PowerType.ABILITY
  }];

  public attacks = [{
    name: 'Ram',
    cost: [Y],
    damage: 10,
    text: ''
  }];

  public set: string = 'FLI';
  public name: string = 'Goomy';
  public fullName: string = 'Goomy FLI 91';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Sticky Membrane
    if (effect instanceof CheckAttackCostEffect) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.getPokemonCard() === this && !IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        const canApplyAbility = new EffectOfAbilityEffect(opponent, this.powers[0], this, effect.player.active);
        store.reduceEffect(state, canApplyAbility);
        if (!canApplyAbility.target) {
          return state;
        }

        effect.cost.push(CardType.COLORLESS);
      }
    }

    return state;
  }
}