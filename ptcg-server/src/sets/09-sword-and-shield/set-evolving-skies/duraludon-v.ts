import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/prefabs';

export class DuraludonV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V, CardTag.SINGLE_STRIKE];
  public cardType: CardType = N;
  public hp: number = 220;
  public weakness = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Metal Claw',
    cost: [F, M],
    damage: 70,
    text: ''
  },
  {
    name: 'Breaking Swipe',
    cost: [F, M, M],
    damage: 140,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 30 less damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Duraludon V';
  public fullName: string = 'Duraludon V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Breaking Swipe
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 30);
    }

    return state;
  }
}
