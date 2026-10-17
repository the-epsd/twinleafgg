import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COIN_FLIPS_FOR_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Buneary extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 4 damage counters from Buneary. Buneary is now Asleep.'
  },
  {
    name: 'Double Kick',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Buneary';
  public fullName: string = 'Buneary LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rest
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    // Double Kick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIPS_FOR_ATTACK(player.active, 'Slam', 2);
    }

    return state;
  }
}
