import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS } from "../../../game/store/prefabs/prefabs";

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public retreat = [C];

  public attacks = [{
    name: 'Limitation',
    cost: [D],
    damage: 0,
    text: 'Your opponent can\'t play any Supporter cards from their hand during their next turn.'
  },
  {
    name: 'Scratch',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'GRI';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sableye';
  public fullName: string = 'Sableye GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Limitation
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(store, state, effect, this);
    }

    return state;
  }
}
