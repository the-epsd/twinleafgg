import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_CANNOT_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Cryogonal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_PLASMA];
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Call Sign',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Water Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Cryofreeze',
    cost: [W],
    damage: 10,
    text: 'Discard an Energy attached to this Pokémon. The Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'PLF';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cryogonal';
  public fullName: string = 'Cryogonal PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call Sign
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {
        cardType: CardType.WATER
      });
    }

    // Cryofreeze
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
