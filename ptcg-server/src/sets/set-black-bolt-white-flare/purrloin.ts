import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../game/store/prefabs/prefabs';

export class Purrloin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Invite Evil',
    cost: [D],
    damage: 0,
    text: 'Search your deck for up to 3 [D] Pokémon, reveal them, and put them into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Purrloin';
  public fullName: string = 'Purrloin WHT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { cardType: CardType.DARK }, { min: 0, max: 3 });
    }

    return state;
  }
}