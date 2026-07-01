import { PokemonCard, Stage, CardType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, GUST_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class Clefairy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Follow Me',
    cost: [P],
    damage: 0,
    text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
  },
  {
    name: 'Flop',
    cost: [P, P],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'POR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Clefairy';
  public fullName: string = 'Clefairy M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Follow Me - Switch opponent's Benched with Active
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return GUST_OPPONENT_BENCHED_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
      });
    }

    return state;
  }
}
