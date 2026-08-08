import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN,
} from '../../../game/store/prefabs/prefabs';

export class Seedot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Bide',
    cost: [G],
    damage: 0,
    text: 'Flip a coin. If heads, if this Pok\u00e9mon would be Knocked Out by damage from an attack during your opponent\'s next turn, it is not Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public set: string = 'STS';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seedot';
  public fullName: string = 'Seedot STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, {});
        }
      });
    }

    return state;
  }
}
