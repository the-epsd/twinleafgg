import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gurdurr2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Timburr';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Focus Energy',
      cost: [C],
      damage: 0,
      text: 'During your next turn, each of this Pokemon\'s attacks does 40 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Low Sweep',
      cost: [F, C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Gurdurr';
  public fullName: string = 'Gurdurr BLW 60';

  public readonly FOCUS_ENERGY_MARKER = 'FOCUS_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Focus Energy - add marker for damage boost next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.FOCUS_ENERGY_MARKER, this);
    }

    // Apply Focus Energy bonus damage
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      if (effect.player.active.marker.hasMarker(this.FOCUS_ENERGY_MARKER, this)) {
        effect.damage += 40;
        // Remove the marker after applying (only applies once)
        effect.player.active.marker.removeMarker(this.FOCUS_ENERGY_MARKER, this);
      }
    }

    // Clean up markers at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.active.marker.removeMarker(this.FOCUS_ENERGY_MARKER, this);
    }

    return state;
  }
}
