import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Frogadier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Froakie';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Duplicates',
    cost: [W],
    damage: 0,
    text: 'Search your deck for up to 3 Frogadier and put them onto your Bench. Shuffle your deck afterward.'
  }];

  public set: string = 'BKP';
  public name: string = 'Frogadier';
  public fullName: string = 'Frogadier BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { name: 'Frogadier' }, { min: 0, max: 3 });
    }
    return state;
  }
}