import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Swanna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ducklett';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Feather Dance',
      cost: [C],
      damage: 0,
      text: 'During your next turn, each of this Pokemon\'s attacks does 40 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Aqua Ring',
      cost: [W, C],
      damage: 40,
      text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Swanna';
  public fullName: string = 'Swanna BLW';

  public readonly FEATHER_DANCE_MARKER = 'FEATHER_DANCE_MARKER';
  public usedAquaRing = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Feather Dance - add marker for damage boost next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.FEATHER_DANCE_MARKER, this);
    }

    // Apply Feather Dance bonus damage
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      if (effect.player.active.marker.hasMarker(this.FEATHER_DANCE_MARKER, this)) {
        effect.damage += 40;
        // Remove the marker after applying (only applies once)
        effect.player.active.marker.removeMarker(this.FEATHER_DANCE_MARKER, this);
      }
    }

    // Aqua Ring - set flag for post-damage switch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedAquaRing = true;
    }

    // Switch self after Aqua Ring damage
    if (effect instanceof AfterAttackEffect && this.usedAquaRing) {
      const player = effect.player;
      this.usedAquaRing = false;
      if (player.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    // Clean up markers at end of turn
    if (effect instanceof EndTurnEffect) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      // Remove Feather Dance marker from opponent's turn end (it lasts through opponent's turn)
      opponent.active.marker.removeMarker(this.FEATHER_DANCE_MARKER, this);
      this.usedAquaRing = false;
    }

    return state;
  }
}
