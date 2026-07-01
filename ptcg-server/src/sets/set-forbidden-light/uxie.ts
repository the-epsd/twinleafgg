import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Uxie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Memory Skip',
    cost: [P],
    damage: 30,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  }];

  public set: string = 'FLI';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Uxie';
  public fullName: string = 'Uxie FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
