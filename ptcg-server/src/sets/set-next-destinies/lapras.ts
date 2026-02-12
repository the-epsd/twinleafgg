import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Call for Family',
      cost: [W],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
    },
    {
      name: 'Reckless Charge',
      cost: [C, C],
      damage: 40,
      text: 'This Pokémon does 20 damage to itself.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lapras';
  public fullName: string = 'Lapras NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family - search for up to 2 Basic Pokémon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, player,
        { stage: Stage.BASIC },
        { min: 0, max: 2 }
      );
    }

    // Reckless Charge - self damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    return state;
  }
}
