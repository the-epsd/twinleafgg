import { Attack, CardType, PokemonCard, Resistance, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}