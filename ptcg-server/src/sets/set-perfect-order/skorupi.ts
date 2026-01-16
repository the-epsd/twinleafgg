import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Skorupi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Poison Jab',
    cost: [D, D],
    damage: 20,
    text: 'Your opponent\'s Active Pokemon is now Poisoned.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Skorupi';
  public fullName: string = 'Skorupi M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Jab - poison opponent's Active Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
