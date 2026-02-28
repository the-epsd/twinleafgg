import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { Attack, State, StoreLike, Weakness } from '../../game';
export class Bonsly extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 30;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [];

  public attacks: Attack[] = [
    { name: 'Blubbering', cost: [], damage: 10, text: 'Your opponent\'s Active Pokémon is now Confused.' },
  ];

  public set: string = 'OBF';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Bonsly';
  public fullName: string = 'Bonsly OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}