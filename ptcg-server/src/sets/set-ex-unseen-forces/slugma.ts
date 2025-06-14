import { PokemonCard, Stage, CardType } from '../../game';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Slugma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 40;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Yawn',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'UF';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fishing Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
