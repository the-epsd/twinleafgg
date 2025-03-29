import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Elgyem extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psybeam',
    cost: [P],
    damage: 10,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'UNM';
  public name: string = 'Elgyem';
  public fullName: string = 'Elgyem UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }

}