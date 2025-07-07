import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Eevee2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Signs of Evolution',
    cost: [C],
    damage: 0,
    text: 'Search your deck for 3 Pokémon of different types that evolve from Eevee. Reveal them and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Bite',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee PLF 90';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { evolvesFrom: 'Eevee' }, { min: 0, max: 3, differentTypes: true });
    }

    return state;
  }
}