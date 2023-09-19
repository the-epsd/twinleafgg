import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_STADIUM_IN_PLAY } from '../../game/store/effect-factories/prefabs';


export class Charmander extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Blazing Destruction',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Discard a Stadium in play.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        DISCARD_STADIUM_IN_PLAY(state);
      },
    },
    { 
      name: 'Steady Firebreathing',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 30,
      text: '',
      effect: undefined
    }
  ];

  public set: string = '151';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander MEW';

}