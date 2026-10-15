import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Peck',
    cost: [],
    damage: 10,
    text: ''
  },
{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'The Defending Pokémon is now Burned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Torchic';
  public fullName: string = 'Torchic GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Singe
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    return state;
  }
}
