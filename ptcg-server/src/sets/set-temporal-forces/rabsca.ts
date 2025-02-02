import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, PowerType, StateUtils } from '../..';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Rabsca extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rellor';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Spherical Shield',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage from and effects of attacks done to your Benched Pokémon by attacks from your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Psychic',
    cost: [CardType.GRASS],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public name: string = 'Rabsca';

  public fullName: string = 'Rabsca TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 30;
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isRabsca1InPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isRabsca1InPlay = true;
        }
      });

      if (!isRabsca1InPlay) {
        return state;
      }

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

      effect.preventDefault = true;
    }
    if (effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (opponent.active) {

        let isRabsca2InPlay = false;
        targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            isRabsca2InPlay = true;
          }
        });

        if (!isRabsca2InPlay) {
          return state;
        }

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

        effect.preventDefault = true;
      }

      return state;
    }
    return state;
  }

}