import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roselia';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleep Poison',
    cost: [G],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep and Poisoned.'
  },
  {
    name: 'Magical Leaf',
    cost: [G, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 40 damage plus 30 more damage and remove 3 damage counters from Roserade.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sleep Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Magical Leaf
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
          HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
      });
    }

    return state;
  }
}
