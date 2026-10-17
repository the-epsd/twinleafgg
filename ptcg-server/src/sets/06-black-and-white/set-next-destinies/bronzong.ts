import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect } from '../../../game/store/effects/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bronzor';
  public cardType: CardType[] = [M];
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Heal Block',
    powerType: PowerType.ABILITY,
    text: 'Damage can\'t be healed from any Pokémon (both yours and your opponent\'s). (Damage counters can still be moved.)'
  }];

  public attacks = [{
    name: 'Oracle Inflict',
    cost: [M, C, C],
    damage: 30,
    text: 'Does 10 more damage for each card in your opponent\'s hand.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heal Block — Ref: set-30th-celebration/yveltal.ts
    if (effect instanceof HealEffect || effect instanceof HealTargetEffect) {
      for (const abilityOwner of state.players) {
        if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
          continue;
        }

        if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
          continue;
        }

        if (!CAN_APPLY_ABILITY_TO_TARGET(
          store,
          state,
          abilityOwner,
          this.powers[0],
          this,
          effect.target,
        )) {
          continue;
        }

        effect.preventDefault = true;
        return state;
      }
    }

    // Oracle Inflict - bonus damage based on opponent's hand size
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const handSize = opponent.hand.cards.length;
      effect.damage += handSize * 10;
    }

    return state;
  }
}
