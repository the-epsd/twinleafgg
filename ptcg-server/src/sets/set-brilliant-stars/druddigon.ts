import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Druddigon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 120;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Revenge',
      cost: [CardType.FIRE, CardType.WATER],
      damage: 40,
      text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 120 more damage.'
    },
    {
      name: 'Dragon Claw',
      cost: [CardType.FIRE, CardType.WATER, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'BRS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Druddigon';

  public fullName: string = 'Druddigon BRS';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 120;
      }

      return state;
    }

    // if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
    //   effect.target.tools.includes(this)) {
    //   const player = StateUtils.getOpponent(state, effect.player);

    //   if (player.active.tools.includes(this)) {
    //     this.damageDealt = true;
    //   }
    // }

    return state;
  }

}
