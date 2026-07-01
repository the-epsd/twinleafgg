import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Murkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mean Look',
    cost: [D],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'UPR';
  public setNumber = '71';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Murkrow';
  public fullName: string = 'Murkrow UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mean Look
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}