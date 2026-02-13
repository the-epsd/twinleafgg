import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Elgyem2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Round Up',
      cost: [P],
      damage: 0,
      text: 'Search your deck for 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
    },
    {
      name: 'Headbutt',
      cost: [P, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Elgyem';
  public fullName: string = 'Elgyem NVI 55';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Round Up - search deck for 2 basic Pokémon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, player,
        { stage: Stage.BASIC },
        { min: 0, max: 2, allowCancel: true }
      );
    }

    return state;
  }
}
