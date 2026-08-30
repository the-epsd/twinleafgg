import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Charm',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  },
  {
    name: 'Tail Smack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'PRC';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skitty';
  public fullName: string = 'Skitty PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charm
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
