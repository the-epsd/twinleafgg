import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class HopsRookidee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.HOPS];
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Intimidating Stare',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon do 20 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Peck',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '133';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hop\'s Rookidee';
  public fullName: string = 'Hop\'s Rookidee JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intimidating Stare
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
