import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Gothita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hypnotic Gaze',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Double Slap',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x' as const,
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    }
  ];

  public set: string = 'LTR';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gothita';
  public fullName: string = 'Gothita LTR 69';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Hypnotic Gaze
    // Ref: AGENTS-patterns.md (special conditions)
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Attack 2: Double Slap
    // Ref: AGENTS-patterns.md (multiple coin flips)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
      });
    }

    return state;
  }
}
