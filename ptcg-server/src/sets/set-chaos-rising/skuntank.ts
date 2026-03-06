import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Skuntank extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Stunky';
  public hp: number = 110;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [D],
    damage: 40,
    text: ''
  },
  {
    name: 'Smash Turn',
    cost: [D, D, C],
    damage: 100,
    text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Skuntank';
  public fullName: string = 'Skuntank M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (hasBench) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }
    return state;
  }
}
