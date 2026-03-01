import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
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
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Gothita';
  public fullName: string = 'Gothita EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 20 * heads;
      });
    }

    return state;
  }
}
