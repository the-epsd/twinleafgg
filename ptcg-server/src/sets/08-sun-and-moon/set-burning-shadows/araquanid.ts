import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Araquanid extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dewpider';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubble Net',
    cost: [C, C],
    damage: 30,
    text: 'Energy can\'t be attached to the Defending Pokémon from your opponent\'s hand during their next turn.'
  },
  {
    name: 'Sharp Fang',
    cost: [G, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'BUS';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Araquanid';
  public fullName: string = 'Araquanid BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble Net
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
