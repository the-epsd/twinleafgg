import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Stunky extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Smokescreen',
    cost: [D],
    damage: 0,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  },
  {
    name: 'Slash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'FLF';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stunky';
  public fullName: string = 'Stunky FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Smokescreen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
