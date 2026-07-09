import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  DRAW_CARDS,
} from '../../../game/store/prefabs/prefabs';

export class Unfezant extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Tranquill';
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Add On',
    cost: [C],
    damage: 0,
    text: 'Draw 4 cards.'
  },
  {
    name: 'Swift Flight',
    cost: [C, C],
    damage: 120,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Unfezant';
  public fullName: string = 'Unfezant SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Add On
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 4);
    }

    // Fly
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
