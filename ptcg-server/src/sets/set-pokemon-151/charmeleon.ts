import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';


export class Charmeleon extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 100;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Combustion',
      cost: [CardType.FIRE],
      damage: 20,
      text: '',
      effect: undefined
    },
    { 
      name: 'Fire Blast',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 70,
      text: 'Discard an Energy from this Pokémon.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
      }
    }
  ];

  public set: string = '151';

  public set2: string = '151';

  public setNumber: string = '5';

  public name: string = 'Charmeleon';

  public fullName: string = 'Charmeleon MEW';
  
}