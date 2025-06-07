import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class DarkGolduck extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Psyduck';
  public tags = [CardTag.DARK];
  public cardType = W;
  public hp = 60;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks: Attack[] = [{
    name: 'Third Eye',
    cost: [P],
    damage: 0,
    text: 'Discard 1 Energy card attached to Dark Golduck in order to draw up to 3 cards.'
  },
  {
    name: 'Super Psy',
    cost: [P, P, C],
    damage: 50,
    text: ''
  }];

  public set = 'TR';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Dark Golduck';
  public fullName = 'Dark Golduck TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      DRAW_CARDS(effect.player, 3);
    }

    return state;
  }

}
