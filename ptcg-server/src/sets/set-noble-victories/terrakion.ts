import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terrakion extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{
    type: CardType.GRASS
  }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Retaliate',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 30,
    text:
      'If any of your Pokemon were Knocked Out by damage from an opponent\'s ' +
      'attack during his or her last turn, this attack does 60 more damage.'
  }, {
    name: 'Land Crush',
    cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public set: string = 'NVI';

  public name: string = 'Terrakion';

  public fullName: string = 'Terrakion NVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 60;
      }

      return state;
    }

    return state;
  }

}
