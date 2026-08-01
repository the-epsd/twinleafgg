import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike } from '../../../game';

export class Bisharp extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pawniard';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Metal Sound',
    cost: [M],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Metal Wallop',
    cost: [M, C],
    damage: 40,
    text: 'During your next turn, this Pokémon\'s Metal Wallop attack does 40 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'XY';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Sound
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    // Metal Wallop
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      source: this,
      bonusDamage: 40,
    });

    return state;
  }
}
