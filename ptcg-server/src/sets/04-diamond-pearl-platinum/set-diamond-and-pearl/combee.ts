import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, GUST_OPPONENT_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Combee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Soliciting Nectar',
    cost: [G],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. The new Defending Pokémon is now Asleep.'
  },
  {
    name: 'Gust',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Combee';
  public fullName: string = 'Combee DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Soliciting Nectar
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return GUST_OPPONENT_BENCHED_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
        onSwitched: () => {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        },
      });
    }

    return state;
  }
}
