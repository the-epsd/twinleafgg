import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Hydreigon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Zweilous';
  public cardType: CardType = N;
  public hp: number = 150;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Consume',
      cost: [D, C, C],
      damage: 40,
      text: 'Heal from this Pokemon the same amount of damage you did to the Defending Pokemon.'
    },
    {
      name: 'Destructor Beam',
      cost: [P, D, C, C],
      damage: 90,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokemon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '98';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hydreigon';
  public fullName: string = 'Hydreigon DRX 98';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Consume - heal damage equal to damage dealt
    // The base damage is 40, so heal 40 (before weakness/resistance modifiers)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
    }

    // Attack 2: Destructor Beam - flip coin, if heads discard energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }
}
