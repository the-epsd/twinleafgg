import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, GamePhase } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Entei extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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

    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && StateUtils.getOpponent(state, effect.player).active.cards.includes(this)) {
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }

}