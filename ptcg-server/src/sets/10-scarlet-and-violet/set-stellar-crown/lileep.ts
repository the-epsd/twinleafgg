import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { BLOCK_RETREAT } from "../../../game/store/prefabs/effect-of-attack-prefabs";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Lileep extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Antique Root Fossil';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bind Down',
    cost: [G],
    damage: 50,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Lileep';
  public fullName: string = 'Lileep SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bind Down
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
