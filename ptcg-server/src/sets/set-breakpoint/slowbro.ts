import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameWinner } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { endGame } from '../../game/store/effect-reducers/check-effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slowpoke';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Careless Head',
    cost: [W],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 50 more damage.'
  },
  {
    name: 'Walk-Off Homer',
    cost: [C, C, C],
    damage: 0,
    text: 'If you use this attack when you have only 1 Prize card left, you win this game.'
  }];

  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Slowbro';
  public fullName: string = 'Slowbro BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const owner = state.activePlayer;

      if (player.getPrizeLeft() === 6) {
        if (owner === 0) {
          state = endGame(store, state, GameWinner.PLAYER_1);
        }
        if (owner === 1) {
          state = endGame(store, state, GameWinner.PLAYER_2);
        }
      }
    }

    return state;
  }
}