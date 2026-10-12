import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Entei extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType[] = [CardType.FIRE];

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Pressure',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon do 20 less damage (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Blaze Ball',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: 'x',
      text: 'This attack does 20 more damage for each [R] Energy ' +
        'attached to this Pokémon.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public regulationMark = 'G';

  public name: string = 'Entei';

  public fullName: string = 'Entei OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.FIRE || cardType === CardType.ANY
        ).length;
      });
      effect.damage += energyCount * 20;
    }

    // Pressure — Ref: set-30th-celebration/pikachu-28.ts / set-chaos-rising/garbodor.ts
    if (effect instanceof DealDamageEffect) {
      const abilityOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }
      if (abilityOwner.active.getPokemonCard() !== this) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, abilityOwner);
      if (effect.player !== opponent || effect.source !== opponent.active) {
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
        effect.source,
      )) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }

}
