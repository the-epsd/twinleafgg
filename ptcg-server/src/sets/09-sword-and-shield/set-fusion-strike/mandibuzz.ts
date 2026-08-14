import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_CANNOT_EVOLVE_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Mandibuzz extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Vullaby';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bone Block',
    cost: [D],
    damage: 20,
    text: 'During your opponent\'s next turn, Pokémon can\'t be played from your opponent\'s hand to evolve the Defending Pokémon.'
  },
  {
    name: 'Dark Cutter',
    cost: [D, C],
    damage: 70,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '173';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mandibuzz';
  public fullName: string = 'Mandibuzz FST 173';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bone Block
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_CANNOT_EVOLVE_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
