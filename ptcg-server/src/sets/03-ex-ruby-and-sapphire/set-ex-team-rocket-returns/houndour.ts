import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
export class Houndour extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 50;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Smokescreen',
    cost: [R, C],
    damage: 20,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  }];

  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Houndour';
  public fullName: string = 'Houndour TRR';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }
}