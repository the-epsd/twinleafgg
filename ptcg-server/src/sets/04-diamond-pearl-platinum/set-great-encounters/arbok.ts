import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Arbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ekans';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Deadly Poison',
    cost: [P],
    damage: 10,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is Poisoned, this attack does 10 damage plus 40 more damage. If the Defending Pokémon is not Poisoned, that Pokémon is now Poisoned.'
  },
  {
    name: 'Wrap',
    cost: [C, C, C],
    damage: 50,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Arbok';
  public fullName: string = 'Arbok GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Deadly Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.damage += 40;
      } else {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    // Wrap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
