import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import {
  IS_ABILITY_BLOCKED,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Chesnaught extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Quilladin';
  public hp: number = 180;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public powers = [
    {
      name: 'Needly Armor',
      powerType: PowerType.ABILITY,
      text: "If this Pokémon is in the Active Spot and is damaged by an attack from your opponent's Pokémon (even if this Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon for each [G] Energy attached to this Pokémon."
    },
  ];

  public attacks = [
    {
      name: 'Impound',
      cost: [G, G, C],
      damage: 160,
      text: "During your opponent's next turn, the Defending Pokémon can't retreat."
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Chesnaught';
  public fullName: string = 'Chesnaught M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Needly Armor
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const checkEnergy = new CheckProvidedEnergyEffect(abilityOwner, effect.target);
      store.reduceEffect(state, checkEnergy);

      let gCount = 0;
      checkEnergy.energyMap.forEach((em) => {
        em.provides.forEach((p) => {
          if (p === G || p === CardType.ANY) {
            gCount++;
          }
        });
      });

      if (gCount > 0) {
        const placeCounters = new PlaceDamageCountersEffect(
          abilityOwner,
          effect.source,
          30 * gCount,
          this,
          this.powers[0],
        );
        store.reduceEffect(state, placeCounters);
      }
    }

    // Impound
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
