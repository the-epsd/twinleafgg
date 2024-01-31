import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_ATTACK_DOES_X_MORE_DAMAGE } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';


export class TestPokemon extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.COLORLESS }];

  public retreat = [  ];

  public attacks = [
    { 
      name: 'Put Energy On Bench',
      cost: [ CardType.COLORLESS],
      damage: 10,
      text: 'You may attach up to 2 Basic Energy from your discard pile to your Benched Pokémon in any way you like.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
      }
    }
  ];

  public set: string = 'TEST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Test';

  public fullName: string = 'Test TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
      THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
    }
    return state;
  }

}