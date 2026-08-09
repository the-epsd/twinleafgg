import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Stunfisk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Attract',
    cost: [F],
    damage: 0,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  },
  {
    name: 'Mud-Slap',
    cost: [F, F, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'LTR';
  public setNumber: string = 'RC12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stunfisk';
  public fullName: string = 'Stunfisk LTR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attract
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
