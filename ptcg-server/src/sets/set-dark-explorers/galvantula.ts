import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Quick Turn',
      cost: [L],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Electrisilk',
      cost: [L, C],
      damage: 30,
      damageCalculation: '+',
      text: 'If the Defending Pokemon has no Retreat Cost, this attack does 40 more damage.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Galvantula';
  public fullName: string = 'Galvantula DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quick Turn - flip 2 coins, 20x heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 20 * heads;
      });
    }

    // Electrisilk - +40 if defending has no retreat cost
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.retreat.length === 0) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
