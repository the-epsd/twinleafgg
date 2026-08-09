import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Growl',
    cost: [W],
    damage: 0,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 20 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Tail Whap',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNB';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Growl
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
