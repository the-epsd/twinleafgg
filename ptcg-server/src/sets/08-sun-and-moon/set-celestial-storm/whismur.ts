import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { StoreLike, State, GameError, GameMessage, CardType, Stage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_TRAINER_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Whismur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bawl',
    cost: [C],
    damage: 0,
    text: 'You can use this attack only if you go second, and only on your first turn. Your opponent can\'t play any Trainer cards from their hand during their next turn.'
  },
  {
    name: 'Pound',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Whismur';
  public fullName: string = 'Whismur CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bawl
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (state.turn !== 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      return OPPONENT_CANNOT_PLAY_TRAINER_CARDS(store, state, effect, this);
    }
    return state;
  }
}
