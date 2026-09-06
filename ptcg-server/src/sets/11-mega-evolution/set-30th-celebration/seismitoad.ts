import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Seismitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Palpitoad';
  public hp: number = 160;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Quaking Fist',
    cost: [F],
    damage: 60,
    text: 'During your opponent\'s next turn, whenever they try to use a Trainer card from their hand, they flip a coin. If tails, your opponent discards that Trainer card instead of using it.'
  },
  {
    name: 'Mega Punch',
    cost: [F, C, C, C],
    damage: 180,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quaking Fist
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS(store, state, effect, this);
    }

    return state;
  }
}
