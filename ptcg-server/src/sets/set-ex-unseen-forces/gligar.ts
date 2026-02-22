import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Gligar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Free Flight',
    powerType: PowerType.ABILITY,
    text: 'If Gligar has no Energy cards attached to it, Gligar\'s Retreat Cost is 0.'
  }];

  public attacks = [{
    name: 'Toxic Grip',
    cost: [F],
    damage: 10,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Gligar';
  public fullName: string = 'Gligar UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length === 0) {
        effect.cost = [];
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}