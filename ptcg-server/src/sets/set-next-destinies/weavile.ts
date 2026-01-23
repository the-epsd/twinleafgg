import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Weavile extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Sneasel';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Dark Penalty',
      cost: [D],
      damage: 90,
      text: 'If the Defending Pokémon has no Pokémon Tool card attached to it, this attack does nothing.'
    },
    {
      name: 'Fury Swipes',
      cost: [C, C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Penalty
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent's active has a tool attached
      const hasTool = opponent.active.tools.length > 0;
      if (!hasTool) {
        effect.damage = 0;
      }
    }

    // Fury Swipes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = heads * 30;
      });
    }

    return state;
  }
}
