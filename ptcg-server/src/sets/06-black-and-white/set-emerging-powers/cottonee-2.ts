import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cottonee2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 50;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Cotton Guard',
    cost: [G],
    damage: 10,
    text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Cottonee';
  public fullName: string = 'Cottonee EPO 10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cotton Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 10;
    }

    return state;
  }
}
