import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Venipede extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Poison Spray',
    cost: [C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Venipede';
  public fullName: string = 'Venipede BLK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Spray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
