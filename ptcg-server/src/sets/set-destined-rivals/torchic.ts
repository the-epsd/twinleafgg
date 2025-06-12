import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Collect',
      cost: [C],
      damage: 0,
      text: 'Draw a card.'
    },
    {
      name: 'Combustion',
      cost: [R],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Torchic';
  public fullName: string = 'Torchic DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }
}
