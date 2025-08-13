import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class EthansPichu extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [CardTag.ETHANS];

  public cardType = L;

  public hp = 30;

  public weakness = [{ type: F }];

  public retreat = [];

  public attacks = [{
    name: 'Sparking Draw',
    cost: [],
    damage: 30,
    text: 'Draw a card.'
  }];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Ethan\'s Pichu';

  public fullName: string = 'Ethan\'s Pichu DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 1);
    }
    return state;
  }
}
