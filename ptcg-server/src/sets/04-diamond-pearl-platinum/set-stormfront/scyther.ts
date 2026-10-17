import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Swords Dance',
    cost: [C],
    damage: 0,
    text: 'During your next turn, Scyther\'s Slashing Strike attack\'s base damage is 60.'
  },
  {
    name: 'Slashing Strike',
    cost: [G, C],
    damage: 30,
    text: 'During your next turn, Scyther can\'t use Slashing Strike.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther SF';

  public readonly SWORDS_DANCE_MARKER = 'SWORDS_DANCE_MARKER';
  public readonly SWORDS_DANCE_CLEAR_MARKER = 'SWORDS_DANCE_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 60,
      bonusMarker: this.SWORDS_DANCE_MARKER,
      clearMarker: this.SWORDS_DANCE_CLEAR_MARKER,
    });

    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
      }
    }

    return state;
  }
}
