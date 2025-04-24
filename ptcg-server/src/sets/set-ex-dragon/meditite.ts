import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meditite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Punch',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Meditate',
      cost: [F, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
    }
  ];

  public set: string = 'DR';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Meditate attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      effect.damage += 1 * opponent.active.damage;
    }
    return state;
  }
} 