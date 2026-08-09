import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Deerling extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Growl',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 20 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Rear Kick',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Deerling';
  public fullName: string = 'Deerling CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Growl
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
