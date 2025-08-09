import { Attack, CardType, PokemonCard, Resistance, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Swablu extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness: Weakness[] = [{ type: L }];
  public resistance: Resistance[] = [{ type: F, value: -20 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Sing', cost: [C], damage: 0, text: 'The Defending Pokémon is now Asleep.' },
    { name: 'Peck', cost: [C, C], damage: 20, text: '' },
  ];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Swablu';
  public fullName: string = 'Swablu DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}