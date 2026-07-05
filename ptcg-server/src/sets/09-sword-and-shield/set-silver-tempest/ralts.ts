import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ralts extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Memory Skip',
    cost: [P],
    damage: 10,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can\'t use that attack.'
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
