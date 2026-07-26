import { PokemonCard, State, StoreLike } from '../../../game';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Pidgeot extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pidgeotto';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Flap',
    cost: [C],
    damage: 40,
    text: '',
  },
  {
    name: 'Fly',
    cost: [C, C, C],
    damage: 150,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.',
  }];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Pidgeot';
  public fullName: string = 'Pidgeot MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fly
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        } else {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }
    return state;
  }
}