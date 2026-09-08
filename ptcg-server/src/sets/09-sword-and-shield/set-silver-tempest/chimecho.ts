import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_ASLEEP_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Chimecho extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dreaming Tone',
    cost: [P],
    damage: 0,
    text: 'During your opponent\'s next turn, if an Energy card is attached to the Defending Pokémon from your opponent\'s hand, that Pokémon will be Asleep.'
  },
  {
    name: 'Hang Down',
    cost: [P, C],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chimecho';
  public fullName: string = 'Chimecho SIT 74';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dreaming Tone
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_ASLEEP_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
