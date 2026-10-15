import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ivysaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bulbasaur';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Leech Seed',
    cost: [G, C],
    damage: 20,
    text: 'Remove 1 damage counter from Ivysaur.'
  },
  {
    name: 'Razor Leaf',
    cost: [G, G, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leech Seed
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
    }

    return state;
  }
}
