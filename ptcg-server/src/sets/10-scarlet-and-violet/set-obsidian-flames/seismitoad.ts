import { PowerType, State, StateUtils, StoreLike, CardType, Stage } from '../../../game';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Seismitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Palpitoad';
  public cardType: CardType[] = [W];
  public hp: number = 170;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Quaking Zone',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost [C] more.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [W, W],
    damage: 120,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 100 more damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quaking Zone — Ref: set-paldean-fates/espathra-ex.ts (Dazzling Gaze)
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

    // Refs: set-boundaries-crossed/meloetta.ts (Echoed Voice), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 100
    });
    return state;
  }
}
