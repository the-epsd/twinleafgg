import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Brionne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Disarming Voice',
    cost: [W, W, C],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Brionne';
  public fullName: string = 'Brionne SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}