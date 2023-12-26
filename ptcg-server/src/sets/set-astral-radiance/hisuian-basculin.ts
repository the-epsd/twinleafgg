import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { SEARCH_YOUR_DECK_FOR_X_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH } from '../../game/store/prefabs/prefabs';


export class HisuianBasculin extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Gather the Crew',
      cost: [ ],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Tackle',
      cost: [ CardType.WATER ],
      damage: 10,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return SEARCH_YOUR_DECK_FOR_X_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH(store, state, effect, 0, 2, Stage.BASIC);
    }

    return state;
  }

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public name: string = 'Hisuian Basculin';

  public fullName: string = 'Hisuian Basculin ASR';
}