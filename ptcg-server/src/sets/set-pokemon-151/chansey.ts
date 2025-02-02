import { PokemonCard, PowerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Chansey extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.COLORLESS;

  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 110;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Lucky Bonus',
      powerType: PowerType.ABILITY,
      text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, before you put it into your hand, you may put it onto your Bench. If you put this Pokémon onto your Bench in this way, flip a coin. If heads, take 1 more Prize card.',
      useWhenInPlay: false
    }
  ];
  
  public attacks = [
    {
      name: 'Gentle Slap',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Chansey';

  public fullName: string = 'Chansey MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    
    return state;
  }
}