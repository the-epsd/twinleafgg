import { PokemonCard, Stage, CardType, CardTag, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BlazikenV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_V, CardTag.RAPID_STRIKE ];

  public cardType: CardType = CardType.FIRE;

  public hp: number = 210;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'High Jump Kick',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  },
  {
    name: 'Fire Spin',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 210,
    text: 'Discard 2 Energy from this Pokémon.'
  }
  ];

  public set: string = 'CRE';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Blaziken V';

  public fullName: string = 'Blaziken V CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 2);
    }
    return state;
  }

}