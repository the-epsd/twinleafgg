import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Swablu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Super Speed',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Swablu during your opponent\'s next turn.'
  },
{
    name: 'Shoot Through',
    cost: [C, C],
    damage: 10,
    text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Swablu';
  public fullName: string = 'Swablu GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Super Speed
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    // Shoot Through
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
    }

    return state;
  }
}
