import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Salandit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Call Sign',
    cost: [R],
    damage: 0,
    text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Salandit';
  public fullName: string = 'Salandit BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1 });
    }

    return state;
  }
}