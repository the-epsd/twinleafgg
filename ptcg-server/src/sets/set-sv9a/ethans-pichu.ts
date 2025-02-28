import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

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

  public set: string = 'SV9a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Ethan\'s Pichu';

  public fullName: string = 'Ethan\'s Pichu SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 1);
    }
    return state;
  }
}
