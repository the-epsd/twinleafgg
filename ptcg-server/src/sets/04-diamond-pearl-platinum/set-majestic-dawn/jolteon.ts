import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { CONFIRMATION_PROMPT, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Jolteon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Thunder Fang',
    cost: [L],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Lightning Strike',
    cost: [L, L, C],
    damage: 50,
    text: 'You may discard 2 Energy attached to Jolteon. If you do, this attack\'s base damage is 90 instead of 50.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Jolteon';
  public fullName: string = 'Jolteon MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Lightning Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const attackEffect = effect;
      CONFIRMATION_PROMPT(store, state, player, wantTo => {
        if (!wantTo) {
          return;
        }
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergy);
        const totalEnergy = checkProvidedEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
        if (totalEnergy < 2) {
          return;
        }
        attackEffect.damage = 90;
        DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, attackEffect, 2);
      });
    }

    return state;
  }
}
