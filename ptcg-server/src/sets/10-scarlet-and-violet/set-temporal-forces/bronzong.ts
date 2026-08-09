import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { OPPONENT_CANNOT_EVOLVE_POKEMON } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bronzor';
  public hp: number = 110;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Evolution Jammer',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, they can\'t play any Pokémon from their hand to evolve their Pokémon.'
  },
  {
    name: 'Super Psy Bolt',
    cost: [P, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolution Jammer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_EVOLVE_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
