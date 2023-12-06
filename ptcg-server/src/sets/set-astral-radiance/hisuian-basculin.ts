import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CHOOSE_CARDS_TO_PUT_ON_BENCH } from '../../game/store/prefabs/prefabs';


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
      text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => 
        CHOOSE_CARDS_TO_PUT_ON_BENCH(store, state, effect, 0, 2, Stage.BASIC)
    },
    {
      name: 'Tackle',
      cost: [ CardType.WATER ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '43';

  public name: string = 'Hisuian Basculin';

  public fullName: string = 'Hisuian Basculin ASR';
}