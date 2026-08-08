import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_COIN_IF_HEADS_DEFENDING_POKEMON_CANNOT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Sandile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Sand-Attack',
    cost: [F],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon\'s attacks do nothing during your opponent\'s next turn.'
  },
  {
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Sandile';
  public fullName: string = 'Sandile BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand-Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_IF_HEADS_DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
