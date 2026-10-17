import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Goomy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [N];
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
      const attackingPlayer = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const abilityOwner = StateUtils.findOwner(state, cardList);

      if (abilityOwner.active.getPokemonCard() !== this) {
        return state;
      }

      if (attackingPlayer === abilityOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        attackingPlayer.active,
      )) {
        return state;
      }

      const index = effect.cost.indexOf(CardType.COLORLESS);
      if (index > -1) {
        effect.cost.splice(index, 0, CardType.COLORLESS);
      } else {
        effect.cost.push(CardType.COLORLESS);
      }
    }

    return state;
  }
}