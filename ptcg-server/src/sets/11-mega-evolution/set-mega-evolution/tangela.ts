import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Poison Powder',
    cost: [G],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  },
  {
    name: 'Hook',
    cost: [G, C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Tangela';
  public fullName: string = 'Tangela MEG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Powder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }
    return state;
  }
}
