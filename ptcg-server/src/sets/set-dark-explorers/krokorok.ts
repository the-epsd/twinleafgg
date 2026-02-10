import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Krokorok extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sandile';

  public cardType: CardType = CardType.DARK;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Mud-Slap',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Corkscrew Punch',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Krokorok';

  public fullName: string = 'Krokorok DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '65';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vanilla attacks with no effects
    return state;
  }

}
