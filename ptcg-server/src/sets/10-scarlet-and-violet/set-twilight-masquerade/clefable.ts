import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Clefable extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Clefairy';

  public regulationMark = 'H';

  public cardType: CardType[] = [CardType.PSYCHIC];

  public weakness = [{ type: CardType.METAL }];

  public hp: number = 120;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      copycatAttack: true,
      text: 'Choose 1 of your opponent\'s Active Pokemon\'s attacks and use it as this attack.'
    },
    {
      name: 'Magical Shot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public name: string = 'Clefable';

  public fullName: string = 'Clefable TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY(store, state, effect as AttackEffect);
    }

    return state;
  }

}
