import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from '../../../game/store/prefabs/prefabs';
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from '../../../game/store/prefabs/attack-effects';

export class Swanna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ducklett';
  public cardType: CardType[] = [W];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Feather Dance',
    cost: [C],
    damage: 0,
    text: 'During your next turn, each of this Pokémon\'s attacks does 40 more damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Aqua Ring',
    cost: [W, C],
    damage: 40,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Swanna';
  public fullName: string = 'Swanna BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Feather Dance
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 40,
      setupAttack: this.attacks[0],
    });

    // Aqua Ring
    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    return state;
  }
}
