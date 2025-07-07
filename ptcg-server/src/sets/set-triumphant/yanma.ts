import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Yanma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Free Flight',
    powerType: PowerType.POKEBODY,
    text: 'If Yanma has no Energy attached to it, Yanma\'s Retreat Cost is 0.'
  }];

  public attacks = [{
    name: 'Dive',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'TM';
  public name: string = 'Yanma';
  public fullName: string = 'Yanma TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length === 0) {
        effect.cost = [];
      }
    }

    return state;
  }

}
