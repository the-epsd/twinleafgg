import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ErikasWeepinbell extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Erika\'s Bellsprout';
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Cut',
    cost: [G],
    damage: 30,
    text: ''
  },
  {
    name: 'Happy Cyclone',
    cost: [G, C],
    damage: 70,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Erika\'s Weepinbell';
  public fullName: string = 'Erika\'s Weepinbell M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    return state;
  }
}