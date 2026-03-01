import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorina';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Poison Horn',
      cost: [P, C],
      damage: 50,
      text: 'The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Double Stomp',
      cost: [P, C, C],
      damage: 60,
      damageCalculation: '+' as const,
      text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Poison Horn
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Attack 2: Double Stomp
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage += heads * 30;
      });
    }

    return state;
  }
}
