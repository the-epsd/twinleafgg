import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Trapinch';
  public cardType: CardType = N;
  public hp: number = 80;
  public weakness = [{ type: Y }];
  public retreat = [C];

  public attacks = [{
    name: 'Sand Attack',
    cost: [C],
    damage: 20,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  },
  {
    name: 'Super Vibration',
    cost: [G, F, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'PRC';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
