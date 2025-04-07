import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_MORE_DAMAGE, THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Totodile extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness: Weakness[] = [{ type: L, value: +10 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Bite',
      cost: [],
      damage: 10,
      text: ''
    },
    {
      name: 'Shining Fang',
      cost: [W],
      damage: 10,
      damageCalculation: '+',
      text: 'If the Defending Pokémon already has any damage counters on it, this attack does 10 damage plus 10 more damage.'
    },
  ];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Totodile';
  public fullName: string = 'Totodile MT';

  public readonly SAND_PIT_MARKER: string = 'SAND_PIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
      }
    }

    return state;
  }
}
