import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, IGNORE_ATTACK_COSTS_FOR_TYPES_DURING_YOUR_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class Sunflora extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sunkern';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Solar Power',
    cost: [C, C],
    damage: 0,
    text: 'During your next turn, ignore all Energy in the attack costs of Grass Pokémon and Fire Pokémon. (This includes Pokémon that come into play on that turn.)'
  },
  {
    name: 'Solar Beam',
    cost: [G, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sunflora';
  public fullName: string = 'Sunflora CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return IGNORE_ATTACK_COSTS_FOR_TYPES_DURING_YOUR_NEXT_TURN(
        store,
        state,
        effect,
        this,
        [CardType.GRASS, CardType.FIRE],
      );
    }

    return state;
  }
}
