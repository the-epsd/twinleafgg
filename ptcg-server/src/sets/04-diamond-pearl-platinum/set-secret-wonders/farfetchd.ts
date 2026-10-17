import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Farfetchd extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Swords Dance',
    cost: [C],
    damage: 0,
    text: 'During your next turn, Farfetch\'d\'s Leek Slap attack\'s base damage is 60.'
  },
  {
    name: 'Leek Slap',
    cost: [C],
    damage: 30,
    text: 'During your next turn, Farfetch\'d can\'t use Leek Slap.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Farfetch\'d';
  public fullName: string = 'Farfetch\'d SW';

  public readonly SWORDS_DANCE_MARKER = 'SWORDS_DANCE_MARKER';
  public readonly SWORDS_DANCE_CLEAR_MARKER = 'SWORDS_DANCE_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swords Dance
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 60,
      bonusMarker: this.SWORDS_DANCE_MARKER,
      clearMarker: this.SWORDS_DANCE_CLEAR_MARKER,
    });

    // Leek Slap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Leek Slap');
    }

    return state;
  }
}
