import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Doublade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Honedge';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [C],
    damage: 20,
    text: ''
  }, {
    name: 'Slashing Strike',
    cost: [M, C],
    damage: 80,
    text: 'During your next turn, this Pokémon can\'t use Slashing Strike.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Doublade';
  public fullName: string = 'Doublade PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
      }
    }

    return state;
  }
}