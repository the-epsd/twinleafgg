import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Orbeetle extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dottler';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Evomancy',
      cost: [C],
      damage: 0,
      text: 'For each Energy attached to this Pokémon, search your deck for a Stage 2 Pokémon, except Orbeetle, and put it onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Zen Headbutt',
      cost: [P, C, C],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Orbeetle';
  public fullName: string = 'Orbeetle BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.length;
      }, 0);

      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name === 'Orbeetle') {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.STAGE_2 }, { min: 0, max: totalEnergy, blocked });
    }

    return state;
  }
}