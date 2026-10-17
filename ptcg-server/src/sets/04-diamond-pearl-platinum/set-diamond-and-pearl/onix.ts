import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: 20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tunneling',
    cost: [F],
    damage: 0,
    text: 'Choose up to 2 of your opponent\'s Benched Pokémon. This attack does 10 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Onix can\'t attack during your next turn.'
  },
  {
    name: 'Headbutt',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Onix';
  public fullName: string = 'Onix DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tunneling
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state, 0, 2);
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
