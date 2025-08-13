import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, DRAW_CARDS } from '../../game/store/prefabs/prefabs';


export class HisuianZorua extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Collect',
      cost: [],
      damage: 0,
      text: 'Draw a card.'
    },
    {
      name: 'Mumble',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: ''
    }
  ];
  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name: string = 'Hisuian Zorua';

  public fullName: string = 'Hisuian Zorua ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 1);
      return state;
    }

    return state;
  }

}
