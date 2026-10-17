import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { COPY_OPPONENT_ACTIVE_ATTACK } from '../../../game/store/prefabs/attack-effects';

export class Clefable extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clefairy';
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Double Slap',
    cost: [C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
  },
  {
    name: 'Metronome',
    cost: [C, C, C],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy cost. (You must still do anything else in order to use that attack.) Clefable performs that attack.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Clefable';
  public fullName: string = 'Clefable DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Slap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage = 30 * results.filter(r => r).length;
      });
    }

    // Metronome
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect as AttackEffect);
    }

    return state;
  }
}
