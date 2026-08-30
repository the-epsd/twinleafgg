import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Medicham extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Meditite';
  public hp: number = 120;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Seventh Kick',
    cost: [F],
    damage: 150,
    text: 'If you don\'t have exactly 7 cards in your hand, this attack does nothing.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Medicham';
  public fullName: string = 'Medicham ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Seventh Kick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length !== 7) {
        effect.damage = 0;
      }
    }

    return state;
  }
}
