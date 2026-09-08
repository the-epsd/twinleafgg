import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Mightyena extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poochyena';
  public cardType: CardType[] = [D];
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Ferocious Bellow',
    cost: [D],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 50 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Pitch-Black Fangs',
    cost: [D, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'VIV';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mightyena';
  public fullName: string = 'Mightyena VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ferocious Bellow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 50);
    }

    return state;
  }
}
