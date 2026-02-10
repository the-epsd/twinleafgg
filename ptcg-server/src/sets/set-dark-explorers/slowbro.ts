import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Slowbro extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slowpoke';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Airhead',
    powerType: PowerType.ABILITY,
    text: 'If you have 2, 4, or 6 Prize Cards left, this Pokemon can\'t attack.'
  }];

  public attacks = [{
    name: 'Lazy Headbutt',
    cost: [W, C],
    damage: 80,
    text: 'This Pokemon is now Asleep.'
  }];

  public set: string = 'DEX';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slowbro';
  public fullName: string = 'Slowbro DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Airhead - prevent attacking if 2, 4, or 6 Prize cards left
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const prizesLeft = player.getPrizeLeft();

      // Check if ability is blocked
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        // Ability is blocked, proceed with attack
        return state;
      }

      // If player has 2, 4, or 6 prizes left, can't attack
      if (prizesLeft === 2 || prizesLeft === 4 || prizesLeft === 6) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Lazy Headbutt - puts self to sleep
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const selfAsleep = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      selfAsleep.target = player.active;
      store.reduceEffect(state, selfAsleep);
    }

    return state;
  }
}
