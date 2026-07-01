import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';
export class Krookodile extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Krokorok';

  public cardType: CardType = D;

  public hp: number = 150;

  public weakness = [{ type: F }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Dark Clamp',
      cost: [D, C, C],
      damage: 60,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Bombast',
      cost: [D, D, C, C],
      damage: 0,
      damageCalculation: 'x',
      text: 'Does 40 damage times the number of Prize cards you have taken.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Krookodile';

  public fullName: string = 'Krookodile DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Clamp - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    // Handle marker-based retreat blocking
    // Bombast - damage based on prizes taken
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // Count prize cards taken (6 total minus remaining)
      const prizesTaken = 6 - player.getPrizeLeft();
      (effect as AttackEffect).damage = 40 * prizesTaken;
    }

    return state;
  }

}
