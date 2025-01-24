import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

// FLI Froakie 21 (https://limitlesstcg.com/cards/FLI/21)
export class FroakieFrubbles extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Frubbles',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any [W] Energy attached to it, it has no Retreat Cost.'
  }];

  public attacks = [
    { name: 'Flop', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'FLI';

  public setNumber = '21';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Froakie';

  public fullName: string = 'Froakie FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      // checking if this thing is in the active because we ain't trusting the conditions
      const pokemonCard = player.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      // checking for the water energies
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let waterCheck = false;
      checkProvidedEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.WATER)) {
          waterCheck = true;
        }
      });

      if (waterCheck) {
        effect.cost = [];
      }
    }

    return state;
  }

}