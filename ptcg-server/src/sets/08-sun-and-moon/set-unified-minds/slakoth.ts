import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { OPPONENT_TURN_ENDS_ON_ENERGY_ATTACH_FROM_HAND_TO_DEFENDING_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Lazy Howl',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, if they attach an Energy card from their hand to the Defending Pokémon, their turn ends.'
  },
  {
    name: 'Hang Down',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '167';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lazy Howl
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_TURN_ENDS_ON_ENERGY_ATTACH_FROM_HAND_TO_DEFENDING_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
