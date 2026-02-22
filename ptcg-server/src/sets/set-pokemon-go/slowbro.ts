import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { TAKE_X_PRIZES, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slowbro extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tumbling Tackle',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'Both Active Pokémon are now Asleep.'
    },
    {
      name: 'Twilight Inspiration',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'You can use this attack only if your opponent has exactly 1 Prize card remaining. Take 2 Prize cards.'
    }
  ];

  public set: string = 'PGO';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Slowbro';

  public fullName: string = 'Slowbro PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const active = opponent.active;

      active.addSpecialCondition(SpecialCondition.ASLEEP);
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() === 1) {
        return TAKE_X_PRIZES(store, state, player, 2);
      }
    }
    return state;
  }
}