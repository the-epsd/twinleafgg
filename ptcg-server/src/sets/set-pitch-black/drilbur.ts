import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Drilbur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Call for Family',
      cost: [C],
      damage: 0,
      text: 'Search your deck for 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterwards.',
    },
    {
      name: 'Dig Claws',
      cost: [C, C, C],
      damage: 50,
      text: '',
    },
  ];

  public set: string = 'M5';
  public setNumber: string = '44';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Drilbur';
  public fullName: string = 'Drilbur M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-sword-and-shield/grookey.ts (Call for Family — up to 2 Basic)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.BASIC }, { min: 0, max: 2 });
    }
    return state;
  }
}
