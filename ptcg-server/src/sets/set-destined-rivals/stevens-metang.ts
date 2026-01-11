import { PokemonCard } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class StevensMetang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Steven\'s Beldum';
  public tags: CardTag[] = [CardTag.STEVENS];
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Metal Slash',
    cost: [M, C],
    damage: 70,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '144';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steven\'s Metang';
  public fullName: string = 'Steven\'s Metang DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Slash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    
    return state;
  }
}