import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/game-effects';
import { State, StateUtils, StoreLike } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HopsCramorant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.HOPS];

  public cardType: CardType = C;

  public hp: number = 110;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Fickle Spitting',
      cost: [C],
      damage: 120,
      text: 'If your opponent doesn\'t have exactly 3 or 4 Prize cards remaining, this attack does nothing.'
    }
  ];

  public regulationMark = 'I';

  public set: string = 'JTG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '138';

  public name: string = 'Hop\'s Cramorant';

  public fullName: string = 'Hop\'s Cramorant JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.getPrizeLeft() !== 3 && opponent.getPrizeLeft() !== 4) {
        effect.damage = 0;
      }
    }
    return state;
  }
}