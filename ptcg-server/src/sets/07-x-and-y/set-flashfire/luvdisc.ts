import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, FLIP_COIN_OPPONENT_CANNOT_DRAW_AT_START_OF_NEXT_TURN, DRAW_CARDS } from "../../../game/store/prefabs/prefabs";

export class Luvdisc extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Heart Wink',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent can\'t draw a card at the beginning of his or her next turn.'
  },
  {
    name: 'Spike Draw',
    cost: [W, C],
    damage: 20,
    text: 'Draw a card.'
  }];

  public set: string = 'FLF';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luvdisc';
  public fullName: string = 'Luvdisc FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heart Wink
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_OPPONENT_CANNOT_DRAW_AT_START_OF_NEXT_TURN(store, state, effect, this);
    }
    // Spike Draw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    return state;
  }
}
