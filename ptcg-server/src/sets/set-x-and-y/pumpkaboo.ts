import { PokemonCard, Stage, CardType, State, StoreLike, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Pumpkaboo extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [P],
      damage: 0,
      text: 'Your opponent\'s Active Pokemon is now Confused.'
    }
  ];

  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Pumpkaboo';
  public fullName: string = 'Pumpkaboo XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }

}