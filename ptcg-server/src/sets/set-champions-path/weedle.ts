import { CardType, Stage, State, StoreLike, SuperType } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Weedle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set = 'CPA';

  public setNumber = '2';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'D';

  public name = 'Weedle';

  public fullName = 'Weedle CPA';

  public attacks = [
    {
      name: 'Call for Family',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a Basic Pokemon and put it onto your Bench. Then, shuffle your deck. '
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Call for Family
    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { superType: SuperType.POKEMON, stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: true });
    }

    return state;
  }
}