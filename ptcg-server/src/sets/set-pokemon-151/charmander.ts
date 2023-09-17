import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_STADIUM_IN_PLAY, WAS_ATTACK_USED } from '../../game/store/effect-factories/prefabs';


export class Charmander extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Blazing Destruction', cost: [CardType.FIRE], damage: 0, text: 'Discard a Stadium in play.' },
    { name: 'Steady Firebreathing', cost: [CardType.FIRE, CardType.FIRE], damage: 30, text: '' }
  ];

  public set: string = '151';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_STADIUM_IN_PLAY(state);
    }
    return state;
  }
}