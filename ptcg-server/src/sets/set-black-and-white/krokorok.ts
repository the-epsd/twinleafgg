import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Krokorok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sandile';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Torment',
    cost: [C, C],
    damage: 30,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Bite',
    cost: [F, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Krokorok';
  public fullName: string = 'Krokorok BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
