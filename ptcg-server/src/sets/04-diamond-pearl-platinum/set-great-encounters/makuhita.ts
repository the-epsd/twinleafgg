import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Makuhita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Arm Thrust',
    cost: [F, C],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, discard an Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Makuhita';
  public fullName: string = 'Makuhita GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Arm Thrust
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        } else {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
