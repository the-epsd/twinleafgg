import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class SeasManaphy3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Famitly',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 [W] Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Surf',
    cost: [W, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '147';
  public name: string = 'Sea\'s Manaphy';
  public fullName: string = 'Sea\'s Manaphy PCGP 147';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { cardType: CardType.WATER, stage: Stage.BASIC }, { min: 0, max: 2 });
    }

    return state;
  }
}

